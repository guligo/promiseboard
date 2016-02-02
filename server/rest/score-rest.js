define(['../dao/score-dao'], function(scoreDao) {

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'score');

        app.post('/promise/:promiseId/score', checkAuthAsync, function(req, res) {
            var dto = {
                promiseId: req.params.promiseId,
                score: req.body.score
            };

            scoreDao.createScore(dto, function() {
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
