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

    var _getPromise =  function(data, onSuccess) {
        $.ajax({
            url: '/promises/' + data.id,
            method: 'get',
            success: function(promise) {
                onSuccess(JSON.parse(promise));
            },
            error: function() {
                console.log(error);
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
        _getPromise({
            id: data.id
        }, function(promise) {
            promise.status = data.status;
            $.ajax({
                url: '/promises',
                method: 'post',
                data: promise,
                success: function() {
                    onSuccess();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }, function(error) {
            console.log(error);
        });
    };

    return {
        createPromise: function(data, onSuccess, onError) {
            _createPromise(data, onSuccess, onError);
        },

        getPromise: function(data, onSuccess) {
            _getPromise(data, onSuccess);
        },

        getPromises: function(onSuccess) {
            _getPromises(onSuccess);
        },

        updatePromiseStatus: function(data, onSuccess, onError) {
            _updatePromiseStatus(data, onSuccess, onError);
        }
    };

})();
