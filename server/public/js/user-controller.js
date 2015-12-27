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

        logOut: function(onSuccess) {
            $.ajax({
                url: '/users/logout',
                method: 'post',
                success: function() {
                    onSuccess();
                },
                error: function() {
                    onSuccess();
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
                }
            });
        }
    };

})();
