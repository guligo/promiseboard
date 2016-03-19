require.config({
    baseUrl: 'js'
});

require(['controllers/user-controller'], function(userController) {

    $(document).ready(function() {
        var resetLoginModalFields = function() {
            $('#loginModalUsernameGroup').removeClass('has-success');
            $('#loginModalUsernameGroup').removeClass('has-error');
            $('#loginModalUsernameLabel').text('Username');
        };

        $('#loginModal').on('shown.bs.modal', function() {
            $(document).on('keypress', function(e) {
                if (!$('#loginModalLoginButton').is(':focus') && e.keyCode === 13) {
                    $('#loginModalLoginButton').click();
                }
            });
            $('#loginModalLoginButton').focus();
        });

        $('#loginModal').on('hide.bs.modal', function() {
            $(document).off('keypress');
        });

        $('#loginModalLoginButton').click(function() {
            resetLoginModalFields();
            userController.logIn({
                username: $('#loginModalUsernameField').val(),
                password: $('#loginModalPasswordField').val(),
                remember: $('#loginModalRememberField').is(':checked')
            }, function() {
                window.location.replace('board.html');
            }, function() {
                $('#loginModalUsernameGroup').addClass('has-error');
                $('#loginModalUsernameLabel').text('Invalid credentials. Please try again!');
            });
        });

        $('#loginModalCloseButton').click(function() {
            resetLoginModalFields();
        });

        $('#registrationModal').on('shown.bs.modal', function() {
            $(document).on('keypress', function(e) {
                if (!$('#registrationModalRegisterButton').is(':focus') && e.keyCode === 13) {
                    $('#registrationModalRegisterButton').click();
                }
            });
            $('#registrationModalRegisterButton').focus();
        });

        $('#registrationModal').on('hide.bs.modal', function() {
            $(document).off('keypress');
        });

        var resetRegistrationModalFields = function() {
            $('#registrationModalUsernameGroup').removeClass('has-success');
            $('#registrationModalUsernameGroup').removeClass('has-error');
            $('#registrationModalUsernameLabel').text('Username');
        }

        $('#registrationModalRegisterButton').click(function() {
            resetRegistrationModalFields();
            userController.register({
                username: $('#registrationModalUsernameField').val(),
                password: $('#registrationModalPasswordField').val(),
                confirm: $('#registrationModalConfirmField').val()
            }, function() {
                window.location.replace('board.html');
            }, function(text) {
                $('#registrationModalUsernameGroup').addClass('has-error');
                $('#registrationModalUsernameLabel').text(text);
            });
        });

        $('#registrationModalCloseButton').click(function() {
            resetRegistrationModalFields();
        });
    });
});
