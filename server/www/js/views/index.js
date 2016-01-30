require.config({
    baseUrl: 'js'
});

require(['controllers/user-controller', 'common-utils'], function(userController, commonUtils) {

    $(document).ready(function() {
        var resetLoginModalFields = function() {
            $('#loginModalUsernameGroup').removeClass('has-success');
            $('#loginModalUsernameGroup').removeClass('has-error');
            $('#loginModalUsernameLabel').text('Username');
        };

        $('#loginModalLoginButton').click(function() {
            resetLoginModalFields();
            userController.logIn({
                username: $('#loginModalUsernameField').val(),
                password: $('#loginModalPasswordField').val()
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
