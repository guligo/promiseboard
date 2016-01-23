var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

requirejs(['express', 'body-parser', 'express-session', 'serve-favicon', 'connect-multiparty', './www/js/common-utils', './dao/user-dao', './dao/promise-dao', './dao/user-instagram-profile-dao', './services/instagram-service'],
    function(express, bodyParser, session, favicon, multipart, commonUtils, userDao, promiseDao, userInstagramProfileDao, instagramService) {

    userDao.init(function() {
        promiseDao.init(function() {
            userInstagramProfileDao.init();
        });
    });

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
    app.use(favicon(__dirname + '/www/img/icon.png'));
    app.set('port', (process.env.PORT || 5000));

    function checkAuthSync(req, res, next) {
        if (!req.session.username) {
            // res.redirect('/index.html');
            req.session.username = 'guligo';
            next();
        } else {
            next();
        }
    }

    app.get('/index.html', function(req, res) {
        delete req.session.username;
        res.sendFile(__dirname + '/www/index.html');
    });

    app.get('/board.html', checkAuthSync, function(req, res) {
        res.sendFile(__dirname + '/www/board.html');
    });

    app.get('/settings.html', checkAuthSync, function(req, res) {
        if (req.query.code) {
            instagramService.getAccessToken(req.query.code, function(authenticationResponse) {
                userInstagramProfileDao.deleteProfile('guligo', function() {
                    userInstagramProfileDao.createProfile(
                        'guligo',
                        authenticationResponse.user.username,
                        authenticationResponse.user.id,
                        authenticationResponse.access_token,
                        function() {
                            res.sendFile(__dirname + '/www/settings.html');
                        }
                    );
                });
            });
        } else {
            res.sendFile(__dirname + '/www/settings.html');
        }
    });

    app.use(express.static(__dirname + '/www'));

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
                try {
                    if (actualUser === undefined) {
                        throw commonUtils.createException('User does not exist');
                    }
                    if (submittedUser.password !== actualUser.password) {
                        throw commonUtils.createException('Wrong password');
                    }

                    req.session.username = actualUser.username;

                    res.sendStatus(200);
                } catch (e) {
                    commonUtils.handleException(e, res);
                }
            });
        } catch (e) {
            commonUtils.handleException(e, res);
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

    app.get('/users/me/profile/instagram', checkAuthAsync, function(req, res) {
        userInstagramProfileDao.getProfile(req.session.username, function(userInstagramProfile) {
            if (userInstagramProfile === undefined) {
                res.sendStatus(200);
            } else {
                res.end(JSON.stringify(userInstagramProfile));
            }
        });
    });

    app.delete('/users/me/profile/instagram', checkAuthAsync, function(req, res) {
        userInstagramProfileDao.deleteProfile(req.session.username, function() {
            res.sendStatus(200);
        });
    });

    app.post('/promises', checkAuthAsync, function(req, res) {
        try {
            var submittedPromise = req.body;

            if (submittedPromise.description === undefined || submittedPromise.description.length <= 0) {
                throw commonUtils.createException('Description empty');
            }
            if (submittedPromise.dueDate === undefined || submittedPromise.dueDate.length == 0) {
                throw commonUtils.createException('Due date empty');
            }

            promiseDao.createPromise(req.session.username, submittedPromise.description, submittedPromise.dueDate, function() {
                res.sendStatus(200);
            });
        } catch (e) {
            commonUtils.handleException(e, res);
        }
    });

    app.get('/promises', checkAuthAsync, function(req, res) {
        var promises = promiseDao.getPromisesByUsername(req.session.username, function(promises) {
            userInstagramProfileDao.getProfile(req.session.username, function(userInstagramProfile) {

                promises.forEach(function(promise) {
                    promise.tags = [];
                    var words = promise.description.split(" ");
                    words.forEach(function(word) {
                        if (word.indexOf('#') === 0) {
                            promise.tags.push(word.substr(1));
                        }
                    });
                });

                if (userInstagramProfile) {
                    instagramService.getRecentMedia(userInstagramProfile.token, function(result) {
                        result.data.forEach(function(recentMedia) {
                            if (recentMedia.tags.indexOf('completed') > -1) {
                                promises.forEach(function(promise) {
                                    promise.tags.forEach(function(tag) {
                                        if (recentMedia.tags.indexOf(tag) > -1) {
                                            promise.attachment = recentMedia.images.standard_resolution.url;
                                            promise.status = 2;
                                        }
                                    });
                                });
                            }
                        });
                        res.end(JSON.stringify(promises));
                    });
                } else {
                    res.end(JSON.stringify(promises));
                }
            });
        });
    });

    app.get('/promises/score', checkAuthAsync, function(req, res) {
        var promises = promiseDao.getScore(req.session.username, function(promises) {
            res.end(JSON.stringify(promises));
        });
    });

    app.post('/promises/:id/status', checkAuthAsync, function(req, res) {
        var promise = promiseDao.updatePromiseStatus(req.params.id, req.body.status, function() {
            res.sendStatus(200);
        });
    });

    var multipartMiddleware = multipart();
    app.post('/promises/:id/attachment', multipartMiddleware, function(req, res) {
        var promise = promiseDao.updatePromiseAttachment(req.params.id, req.files['file'].path, function() {
            res.sendStatus(200);
        });
    });

    app.get('/promises/:id/attachment', function(req, res) {
        var promise = promiseDao.getPromiseById(req.params.id, function(promise) {
            if (promise.attachment && (promise.attachment.indexOf('http') > - 1|| promise.attachment.indexOf('https') > -1)) {
                res.redirect(promise.attachment);
            } else {
                console.log(promise.attachment);
                res.sendFile(promise.attachment);
            }
        });
    });

    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

});
