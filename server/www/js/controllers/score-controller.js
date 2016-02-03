define(function() {

    var _inflate = function(dto, onSuccess, onError) {
        dto.score = +1;
        _addScore(dto, onSuccess, onError);
    };

    var _deflate = function(dto, onSuccess, onError) {
        dto.score = -1;
        _addScore(dto, onSuccess, onError);
    };

    var _addScore = function(dto, onSuccess, onError) {
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

    var _getScore = function(dto, onSuccess, onError) {
        $.ajax({
            url: '/promises/' + dto.promiseId + '/score',
            method: 'get',
            data: {
                score: dto.score
            },
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

    var _getScoreByPromiseStatus = function(dto, onSuccess, onError) {
        $.ajax({
            url: '/promises/score/' + dto.status + '/sum',
            method: 'get',
            data: {
                score: dto.status
            },
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

    return {
        inflate: function(dto, onSuccess, onError) {
            _inflate(dto, onSuccess, onError);
        },
        deflate: function(dto, onSuccess) {
            _deflate(dto, onSuccess);
        },
        getScore: function(dto, onSuccess, onError) {
            _getScore(dto, onSuccess, onError);
        },
        getScoreByPromiseStatus: function(dto, onSuccess, onError) {
            _getScoreByPromiseStatus(dto, onSuccess, onError);
        }
    };

});
