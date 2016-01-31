define(['./user-rest', './promise-rest', './user-profile-rest', './attachment-rest', './score-rest'],
    function(userRest, promiseRest, userProfileRest, attachmentRest, scoreRest) {

    var _init = function(app, checkAuthAsync, callback) {
        console.log('Initializing REST web-services');

        userRest.init(app, checkAuthAsync);
        promiseRest.init(app, checkAuthAsync);
        userProfileRest.init(app, checkAuthAsync);
        attachmentRest.init(app, checkAuthAsync);
        scoreRest.init(app, checkAuthAsync);
    };

    return {
        init: function(app, checkAuthAsync, callback) {
            _init(app, checkAuthAsync, callback);
        }
    };

});
