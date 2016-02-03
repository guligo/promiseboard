define(['./user-dao', './promise-dao', './user-profile-dao', './attachment-dao', './score-dao'],
    function(userDao, promiseDao, userProfileDao, attachmentDao, scoreDao) {

    var _init = function(callback) {
        console.log('Initializing DAOs');

        userDao.init(function() {
            promiseDao.init(function() {
                userProfileDao.init(function() {
                    attachmentDao.init(function() {
                        scoreDao.init(callback);
                    });
                });
            });
        });
    };

    return {
        init: function(callback) {
            _init(callback);
        }
    };

});
