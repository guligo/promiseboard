define(['common-utils'], function(commonUtils) {

    var _createAttachment = function(dto, onSuccess, onError) {
        $.ajax({
            url: '/attachment/' + dto.id,
            method: 'post',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function() {
                onSuccess();
            },
            error: function(error) {
                commonUtils.handleClientException(error);
            }
        });
    };

    var _hasAttachment = function(dto, onSuccess) {
        $.ajax({
            url: '/attachment/' + dto.id,
            method: 'get',
            success: function(result) {
                onSuccess(JSON.parse(result));
            },
            error: function(error) {
                commonUtils.handleClientException(error);
            }
        });
    };

    return {
        createAttachment: function(dto, onSuccess, onError) {
            _createAttachment(dto, onSuccess, onError);
        },
        hasAttachment: function(dto, onSuccess) {
            _hasAttachment(dto, onSuccess);
        }
    };

});
