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
            url: '/promise/' + dto.promiseId + '/score',
            method: 'post',
            data: {
                score: dto.score
            },
            success: function() {
                onSuccess();
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
        }
    };

});
