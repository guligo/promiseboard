var userController = (function() {

    return {
        logIn: function(data, onSuccess, onError) {
            $.ajax({
                url: '/users/login',
                method: 'post',
                data: {
                    username: data.username,
                    password: data.password
                },
                success: function() {
                    onSuccess();
                },
                error: function() {
                    onError();
                }
            });
        },

        register: function(data, onSuccess, onError) {
            $.ajax({
                url: '/users/register',
                method: 'post',
                data: {
                    username: data.username,
                    password: data.password,
                    confirm: data.confirm
                },
                success: function() {
                    onSuccess();
                },
                error: function(error) {
                    onError(error.responseText);
                },
            });
        }
    };

})();
