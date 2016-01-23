define(['../dao/user-instagram-profile-dao'], function(userInstagramProfileDao) {

    var _init = function(app, checkAuthAsync) {

        console.log('Initializing REST [%s] module...', 'user-profile');

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

        console.log('REST [%s] module initialized!', 'user-profile');

    }

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    }

});
