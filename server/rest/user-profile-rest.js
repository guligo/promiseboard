define(['../dao/user-profile-dao'], function(userProfileDao) {

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'user-profile');

        app.get('/users/me/profile/instagram', checkAuthAsync, function(req, res) {
            userProfileDao.getInstagramProfile(req.session.username, function(instagramProfile) {
                if (instagramProfile === undefined) {
                    res.sendStatus(200);
                } else {
                    res.end(JSON.stringify(instagramProfile));
                }
            });
        });

        app.delete('/users/me/profile/instagram', checkAuthAsync, function(req, res) {
            userProfileDao.deleteInstagramProfile(req.session.username, function() {
                res.sendStatus(200);
            });
        });
    };

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    };

});
