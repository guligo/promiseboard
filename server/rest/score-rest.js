define(['../dao/score-dao'], function(scoreDao) {

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'score');
    };

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    };

});
