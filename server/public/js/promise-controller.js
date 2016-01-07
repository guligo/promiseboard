var promiseController = (function() {

    var _createPromise = function(data, onSuccess, onError) {
        $.ajax({
            url: '/promises',
            method: 'post',
            data: {
                username: data.username,
                description: data.description,
                dueDate: data.dueDate
            },
            success: function() {
                onSuccess();
            },
            error: function(error) {
                onError(error.responseText);
            }
        });
    };

    var _createPromiseAttachment = function(data, formData, onSuccess) {
        $.ajax({
            url: '/promises/' + data.id + '/attachment',
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
            url: '/promises',
            method: 'post',
            data: {
                id: data.id,
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

    return {
        createPromise: function(data, onSuccess, onError) {
            _createPromise(data, onSuccess, onError);
        },
        createPromiseAttachment: function(data, formData, onSuccess) {
            _createPromiseAttachment(data, formData, onSuccess);
        },
        getPromises: function(onSuccess) {
            _getPromises(onSuccess);
        },
        updatePromiseStatus: function(data, onSuccess, onError) {
            _updatePromiseStatus(data, onSuccess, onError);
        }
    };

})();
