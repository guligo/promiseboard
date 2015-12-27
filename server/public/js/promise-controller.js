var promiseController = (function() {

    var _getPromise =  function(data, onSuccess, onError) {
        $.ajax({
            url: '/promises/' + data.id,
            method: 'get',
            success: function(promise) {
                onSuccess(JSON.parse(promise));
            },
            error: function() {
                onError();
            }
        });
    };

    return {
        createPromise: function(data, onSuccess, onError) {
            $.ajax({
                url: '/promises',
                method: 'post',
                data: {
                    username: data.username,
                    description: data.description
                },
                success: function() {
                    onSuccess();
                },
                error: function(error) {
                    onError(error.responseText);
                }
            });
        },

        getPromise: function(data, onSuccess, onError) {
            _getPromise(data, onSuccess, onError);
        },

        getPromises: function(onSuccess, onError) {
            $.ajax({
                url: '/promises',
                method: 'get',
                success: function(promises) {
                    onSuccess(JSON.parse(promises));
                },
                error: function() {
                    onError();
                }
            });
        },

        updatePromiseStatus: function(data, onSuccess, onError) {
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
                    error: function() {
                        onError();
                    }
                });
            }, function() {
                onError();
            });
        }
    };

})();
