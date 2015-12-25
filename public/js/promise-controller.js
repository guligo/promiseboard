var promiseController = (function() {

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
        }
    };

})();
