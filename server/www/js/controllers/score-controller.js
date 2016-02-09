define(function() {

    var _inflate = function(dto, onSuccess) {
        dto.score = +1;
        _addScore(dto, onSuccess);
    };

    var _deflate = function(dto, onSuccess) {
        dto.score = -1;
        _getScore(dto, function(score) {
            if (score > 0) {
                _addScore(dto, onSuccess);
            }
        });
    };

    var _addScore = function(dto, onSuccess) {
        $.ajax({
            url: '/promises/' + dto.promiseId + '/score',
            method: 'post',
            data: {
                score: dto.score
            },
            success: function() {
                if (onSuccess) {
                    onSuccess();
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    var _getScore = function(dto, onSuccess) {
        $.ajax({
            url: '/promises/' + dto.promiseId + '/score',
            method: 'get',
            success: function(score) {
                if (onSuccess) {
                    onSuccess(JSON.parse(score));
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    var _getScoreByPromiseStatus = function(dto, onSuccess) {
        $.ajax({
            url: '/promises/score/' + dto.status + '/sum',
            method: 'get',
            success: function(score) {
                if (onSuccess) {
                    onSuccess(JSON.parse(score));
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    var _getLatestScoreDate = function(onSuccess) {
        $.ajax({
            url: '/promises/score/date',
            method: 'get',
            success: function(scoreDate) {
                if (onSuccess) {
                    onSuccess(JSON.parse(scoreDate));
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    return {
        inflate: function(dto, onSuccess) {
            _inflate(dto, onSuccess);
        },
        deflate: function(dto, onSuccess) {
            _deflate(dto, onSuccess);
        },
        getScore: function(dto, onSuccess) {
            _getScore(dto, onSuccess);
        },
        getScoreByPromiseStatus: function(dto, onSuccess) {
            _getScoreByPromiseStatus(dto, onSuccess);
        },
        getLatestScoreDate: function(onSuccess) {
            _getLatestScoreDate(onSuccess);
        }
    };

});
