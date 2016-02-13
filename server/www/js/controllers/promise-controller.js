define(function() {

    var _createPromise = function(data, onSuccess, onError) {
        $.ajax({
            url: '/promises',
            method: 'post',
            data: {
                username: data.username,
                description: data.description,
                tag: data.tag,
                dueDate: data.dueDate
            },
            success: function() {
                onSuccess();
            },
            error: function(error) {
                onError(JSON.parse(error.responseText));
            }
        });
    };

    var _getPromises = function(onSuccess) {
        $.ajax({
            url: '/promises',
            method: 'get',
            success: function(promises) {
                onSuccess(JSON.parse(promises));
            },
            error: function(error) {
                console.log(error);
            }
        });
    };

    var _updatePromiseStatus = function(data, onSuccess, onError) {
        $.ajax({
            url: '/promises/' + data.id + '/status',
            method: 'post',
            data: {
                status: data.status
            },
            success: function() {
                onSuccess();
            },
            error: function(error) {
                console.log(error);
            }
        });
    };

    var _updatePromiseAttachment = function(data, formData, onSuccess) {
        $.ajax({
            url: '/attachment/' + data.id,
            method: 'post',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function() {
                onSuccess();
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    return {
        createPromise: function(data, onSuccess, onError) {
            _createPromise(data, onSuccess, onError);
        },
        getPromises: function(onSuccess) {
            _getPromises(onSuccess);
        },
        updatePromiseStatus: function(data, onSuccess, onError) {
            _updatePromiseStatus(data, onSuccess, onError);
        },
        updatePromiseAttachment: function(data, formData, onSuccess) {
            _updatePromiseAttachment(data, formData, onSuccess);
        }
    };

});
