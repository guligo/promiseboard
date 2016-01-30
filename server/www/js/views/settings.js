require.config({
    baseUrl: 'js'
});

require(['constantz', 'controllers/user-controller'], function(constants, userController) {

    var _setInstagramProfileConnected = function(flag) {
        var socialBtn = $('#socialBtnInstagram');
        var socialBtnText = $('#socialBtnInstagramText');

        socialBtn.removeClass('pb-social-button-disconnected');
        if (flag === true) {
            socialBtn.off('click');
            socialBtn.click(function() {
                userController.deleteMyInstagramProfile(function() {
                    _getInstagramProfile();
                });
            });
            socialBtnText.text('Disconnect from Instagram account');
        } else {
            socialBtn.off('click');
            socialBtn.click(function() {
                window.location.replace(
                    'https://api.instagram.com/oauth/authorize/' +
                    '?client_id=155ca6567e7f4e88938be2c8ded2de58&redirect_uri=' + constants.INSTAGRAM_REDIRECT_URL + '&response_type=code'
                );
            });
            socialBtn.addClass('pb-social-button-disconnected');
            socialBtnText.text('Connect with Instagram account');
        }
    };

    var _getInstagramProfile = function() {
        userController.getMyInstagramProfile(function(userInstagramProfile) {
            _setInstagramProfileConnected(userInstagramProfile !== undefined);
        });
    };

    $(document).ready(function() {
        _getInstagramProfile();
    });

});
