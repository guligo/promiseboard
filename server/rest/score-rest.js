define(['../dao/score-dao'], function(scoreDao) {

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'score');

        app.get('/promises/score/date', checkAuthAsync, function(req, res) {
            var dto = {
                username: req.session.username
            };

            scoreDao.getLatestScoreDateByUser(dto, function(scoreDate) {
                res.end(JSON.stringify(scoreDate));
            });
        });

        app.post('/promises/:promiseId/score', checkAuthAsync, function(req, res) {
            var dto = {
                promiseId: req.params.promiseId,
                score: req.body.score
            };

            scoreDao.createScore(dto, function() {
                res.sendStatus(200);
            });
        });

        app.get('/promises/:promiseId/score', checkAuthAsync, function(req, res) {
            var dto = {
                promiseId: req.params.promiseId
            };

            scoreDao.getScore(dto, function(score) {
                res.end(JSON.stringify(score));
            });
        });

        app.get('/promises/score/:status/sum', checkAuthAsync, function(req, res) {
            var dto = {
                status: req.params.status
            };

            scoreDao.getScoreByPromiseStatus(dto, function(score) {
                res.end(JSON.stringify(score));
            });
        });
    };

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    };

});
