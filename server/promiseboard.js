var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

requirejs(['express', 'body-parser', 'express-session', 'serve-favicon', 'connect-multiparty', './public/js/common-utils', './dao/user-dao', './dao/promise-dao'],
    function(express, bodyParser, session, favicon, multipart, commonUtils, userDao, promiseDao) {

    var app = express();
    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(session({
        secret: 'kuss',
        cookie: {
            maxAge: 300000
        }
    }));
    app.use(favicon(__dirname + '/public/img/icon.png'));
    app.set('port', (process.env.PORT || 5000));
        function checkAuthSync(req, res, next) {
        if (!req.session.username) {
            res.redirect('/index.html');
        } else {
            next();
        }
    }

    app.get('/index.html', function(req, res) {
        delete req.session.username;
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/board.html', checkAuthSync, function(req, res) {
        res.sendFile(__dirname + '/public/board.html');
    });

    app.use(express.static(__dirname + '/public'));

    function checkAuthAsync(req, res, next) {
        if (!req.session.username) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    app.post('/users/login', function(req, res) {
        try {
            var submittedUser = req.body;
            userDao.getUserByUsername(submittedUser.username, function(actualUser) {
                if (actualUser === undefined) {
                    throw commonUtils.createException('User does not exist');
                }
                if (submittedUser.password !== actualUser.password) {
                    throw commonUtils.createException('Wrong password');
                }

                req.session.username = actualUser.username;
                res.sendStatus(200);
            });
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    });

    app.get('/users/me', checkAuthAsync, function(req, res) {
        res.end(JSON.stringify({
            username: req.session.username
        }));
    });

    app.post('/users/logout', checkAuthAsync, function(req, res) {
        delete req.session.username;
        res.sendStatus(200);
    });

    app.post('/users/register', function(req, res) {
        try {
            var submittedUser = req.body;

            if (submittedUser.username.length < 6) {
                throw commonUtils.createException('Username too short');
            }
            if (submittedUser.password.length < 6) {
                throw commonUtils.createException('Password too short');
            }
            if (submittedUser.password !== submittedUser.confirm) {
                throw commonUtils.createException('Password and password confirmation do not match');
            }

            userDao.getUserByUsername(submittedUser.username, function(user) {
                try {
                    if (user === undefined) {
                        userDao.createUser(submittedUser.username, submittedUser.password, function() {
                            res.sendStatus(200);
                        });
                    } else {
                        throw commonUtils.createException('User already exists');
                    }
                } catch (e) {
                    commonUtils.handleException(e, res);
                }
            });
        } catch (e) {
            commonUtils.handleException(e, res);
        }
    });

    app.post('/promises', checkAuthAsync, function(req, res) {
        try {
            var submittedPromise = req.body;

            if (submittedPromise.id !== undefined) {
                promiseDao.updatePromiseStatus(submittedPromise.id, submittedPromise.status, function() {
                    res.sendStatus(200);
                });
            } else {
                if (submittedPromise.description === undefined || submittedPromise.description.length <= 0) {
                    throw commonUtils.createException('Description empty');
                }
                if (submittedPromise.dueDate === undefined || submittedPromise.dueDate.length == 0) {
                    throw commonUtils.createException('Due date empty');
                }

                promiseDao.createPromise(req.session.username, submittedPromise.description, submittedPromise.dueDate, function() {
                    res.sendStatus(200);
                });
            }
        } catch (e) {
            commonUtils.handleException(e, res);
        }
    });

    app.get('/promises', checkAuthAsync, function(req, res) {
        var promises = promiseDao.getPromisesByUsername(req.session.username, function(promises) {
            res.end(JSON.stringify(promises));
        });
    });

    var multipartMiddleware = multipart();
    app.post('/promises/:id/attachment', multipartMiddleware, function(req, res) {
        var promise = promiseDao.createPromiseAttachment(req.params.id, req.files['file'].path, function() {
            res.sendStatus(200);
        });
    });

    app.get('/promises/:id/attachment', function(req, res) {
        var promise = promiseDao.getPromiseById(req.params.id, function(promise) {
            res.sendfile(promise.attachment);
        });
    });

    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

});
