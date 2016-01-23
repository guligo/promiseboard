var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

requirejs(['express', 'body-parser', 'express-session', 'serve-favicon', './www/js/constantz', './dao/user-dao', './dao/promise-dao', './dao/user-instagram-profile-dao', './services/instagram-service', './rest/user-rest', './rest/promise-rest'],
    function(express, bodyParser, session, favicon, constants, userDao, promiseDao, userInstagramProfileDao, instagramService, userRest, promiseRest) {

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

    userDao.init(function() {
        promiseDao.init(function() {
            userInstagramProfileDao.init();
        });
    });

    function checkAuthSync(req, res, next) {
        if (!req.session.username) {
            // res.redirect('/index.html');
            req.session.username = 'guligo';
            next();
        } else {
            next();
        }
    }

    function checkAuthAsync(req, res, next) {
        if (!req.session.username) {
            res.sendStatus(401);
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
                            res.redirect('/settings.html');
                        }
                    );
                });
            });
        } else {
            res.sendFile(__dirname + '/www/settings.html');
        }
    });

    app.use(express.static(__dirname + '/www'));

    userRest.init(app, checkAuthAsync);
    promiseRest.init(app, checkAuthAsync);

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

    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

});
