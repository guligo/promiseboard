define(function() {

    var _logIn = function(data, onSuccess, onError) {
        $.ajax({
            url: '/users/login',
            method: 'post',
            data: {
                username: data.username,
                password: data.password,
                remember: data.remember
            },
            success: function() {
                onSuccess();
            },
            error: function() {
                onError();
            }
        });
    };

    var _logOut = function(onSuccess) {
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
    };

    var _register = function(data, onSuccess, onError) {
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
    };

    var _getMe = function(onSuccess) {
        $.ajax({
            url: '/users/me',
            method: 'get',
            success: function(user) {
                onSuccess(JSON.parse(user));
            },
            error: function() {
                onSuccess();
            }
        });
    };

    var _getMyInstagramProfile = function(onSuccess, onError) {
        $.ajax({
            url: '/users/me/profile/instagram',
            method: 'get',
            success: function(userInstagramProfile) {
                try {
                    onSuccess(JSON.parse(userInstagramProfile));
                } catch (e) {
                    onSuccess();
                }
            },
            error: function() {
                onError();
            }
        });
    };

    var _deleteMyInstagramProfile = function(onSuccess, onError) {
        $.ajax({
            url: '/users/me/profile/instagram',
            method: 'delete',
            success: function() {
                onSuccess();
            },
            error: function() {
                onError();
            }
        });
    };

    return {
        logIn: function(data, onSuccess, onError) {
            _logIn(data, onSuccess, onError);
        },
        logOut: function(onSuccess) {
            _logOut(onSuccess);
        },
        register: function(data, onSuccess, onError) {
            _register(data, onSuccess, onError);
        },
        getMe: function(onSuccess) {
            _getMe(onSuccess);
        },
        getMyInstagramProfile: function(onSuccess, onError) {
            _getMyInstagramProfile(onSuccess, onError);
        },
        deleteMyInstagramProfile: function(onSuccess, onError) {
            _deleteMyInstagramProfile(onSuccess, onError);
        }
    };

});
