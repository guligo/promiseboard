define(['../www/js/constantz', '../www/js/common-utils', '../dao/user-dao'], function(constants, commonUtils, userDao) {

    var _init = function(app, checkAuthAsync) {

        console.log('Initializing REST [%s] module', 'user');

        app.post('/users/login', function(req, res) {
            try {
                var submittedUser = req.body;
                userDao.getUserByUsername(submittedUser.username, function(actualUser) {
                    try {
                        if (actualUser === undefined) {
                            throw commonUtils.createException('User does not exist');
                        }
                        if (submittedUser.password !== actualUser.password) {
                            throw commonUtils.createException('Wrong password');
                        }

                        req.session.username = actualUser.username;
                        res.sendStatus(200);
                    } catch (e) {
                        commonUtils.handleException(e, res);
                    }
                });
            } catch (e) {
                commonUtils.handleException(e, res);
            }
        });

        app.get('/users/me', checkAuthAsync, function(req, res) {
            res.end(JSON.stringify({
                username: req.session.username
            }));
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

                userDao.getUserByUsername(submittedUser.username, function(user) {
                    try {
                        if (user === undefined) {
                            userDao.createUser(submittedUser.username, submittedUser.password, function() {
                                res.sendStatus(200);
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
    }

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    }

});
