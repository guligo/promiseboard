define(['crypto', '../www/js/constantz', '../www/js/common-utils', '../dao/user-dao', '../dao/user-profile-dao'],
    function(crypto, constants, commonUtils, userDao, userProfileDao) {

    var _doLogin = function(submittedUser, onSuccess, onError) {
        var dto = {
            username: submittedUser.username
        };

        userDao.getUserByUsername(dto, function(actualUser) {
            try {
                if (actualUser === undefined) {
                    throw commonUtils.createException('User does not exist');
                }
                if (crypto.createHash('md5').update(submittedUser.password).digest("hex") !== actualUser.password) {
                    throw commonUtils.createException('Wrong password');
                }
                if (onSuccess) {
                    onSuccess();
                }
            } catch (e) {
                onError(e);
            }
        });
    };

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'user');

        app.post('/users/login', function(req, res) {
            try {
                var submittedUser = req.body;
                _doLogin(submittedUser, function(instagramProfile) {
                    req.session.username = submittedUser.username;
                    res.sendStatus(200);
                }, function(e) {
                    commonUtils.handleException(e, res);
                });
            } catch (e) {
                commonUtils.handleException(e, res);
            }
        });

        app.get('/users/me', checkAuthAsync, function(req, res) {
            var dto = {
                username: req.session.username
            };

            userProfileDao.getInstagramProfile(dto, function(instagramProfile) {
                res.end(JSON.stringify({
                    username: req.session.username,
                    hasInstagramProfile: (instagramProfile != undefined)
                }));
            })
        });

        app.post('/users/logout', checkAuthAsync, function(req, res) {
            delete req.session.username;
            res.sendStatus(200);
        });

        app.post('/users/register', function(req, res) {
            try {
                var submittedUser = req.body;

                if (submittedUser.username.length < 6) {
                    throw commonUtils.createException('Username too short');
                }
                if (submittedUser.password.length < 6) {
                    throw commonUtils.createException('Password too short');
                }
                if (submittedUser.password !== submittedUser.confirm) {
                    throw commonUtils.createException('Password and password confirmation do not match');
                }

                var dto = {
                    username: submittedUser.username
                };

                userDao.getUserByUsername(dto, function(user) {
                    try {
                        if (user === undefined) {
                            var dto = {
                                username: submittedUser.username,
                                password: crypto.createHash('md5').update(submittedUser.password).digest("hex")
                            };

                            userDao.createUser(dto, function() {
                                _doLogin(submittedUser, function() {
                                    req.session.username = submittedUser.username;
                                    res.sendStatus(200);
                                }, function(e) {
                                    commonUtils.handleException(e, res);
                                });
                            });
                        } else {
                            throw commonUtils.createException('User already exists');
                        }
                    } catch (e) {
                        commonUtils.handleException(e, res);
                    }
                });
            } catch (e) {
                commonUtils.handleException(e, res);
            }
        });
    };

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    };

});
