define(['./user-dao', './promise-dao', './user-instagram-profile-dao', './attachment-dao'],
    function(userDao, promiseDao, userInstagramProfileDao, attachmentDao) {

    var _init = function(callback) {
        console.log('Initializing DAOs');

        userDao.init(function() {
            promiseDao.init(function() {
                userInstagramProfileDao.init(function() {
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
