define(['./user-dao', './promise-dao', './user-profile-dao', './attachment-dao'],
    function(userDao, promiseDao, userProfileDao, attachmentDao) {

    var _init = function(callback) {
        console.log('Initializing DAOs');

        userDao.init(function() {
            promiseDao.init(function() {
                userProfileDao.init(function() {
                    attachmentDao.init(callback);
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
