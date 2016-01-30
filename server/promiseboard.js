var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

requirejs(['express', 'body-parser', 'express-session', 'serve-favicon', './www/js/constantz', './dao/init-dao', './dao/user-instagram-profile-dao', './services/instagram-service', './rest/init-rest'],
    function(express, bodyParser, session, favicon, constants, initDao, userInstagramProfileDao, instagramService, initRest) {

    var app = express();
    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Oops, something broke!');
    });
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

    function checkAuthAsync(req, res, next) {
        if (!req.session.username) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    initDao.init();
    initRest.init(app, checkAuthAsync);

    app.get('/index.html', function(req, res) {
        delete req.session.username;
        res.sendFile(__dirname + '/www/views/index.html');
    });

    app.get('/board.html', checkAuthSync, function(req, res) {
        res.sendFile(__dirname + '/www/views/board.html');
    });

    app.get('/settings.html', checkAuthSync, function(req, res) {
        if (req.query.code) {
            instagramService.getAccessToken(req.query.code, function(authenticationResponse) {
                userInstagramProfileDao.recreateProfile(req.session.username, authenticationResponse, function() {
                    res.redirect('/settings.html');
                });
            });
        } else {
            res.sendFile(__dirname + '/www/views/settings.html');
        }
    });

    app.use(express.static(__dirname + '/www'));

    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

});
