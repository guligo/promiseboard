define(['connect-multiparty', '../www/js/constantz', '../www/js/common-utils', '../dao/promise-dao', '../dao/user-instagram-profile-dao', '../services/instagram-service'],
    function(multipart, constants, commonUtils, promiseDao, userInstagramProfileDao, instagramService) {

    var _init = function(app, checkAuthAsync) {

        console.log('Initializing REST [%s] module...', 'promise');

        app.post('/promises', checkAuthAsync, function(req, res) {
            try {
                var submittedPromise = req.body;

                if (submittedPromise.description === undefined || submittedPromise.description.length <= 0) {
                    throw commonUtils.createException('Description empty');
                }
                if (submittedPromise.dueDate === undefined || submittedPromise.dueDate.length == 0) {
                    throw commonUtils.createException('Due date empty');
                }

                promiseDao.createPromise(req.session.username, submittedPromise.description, submittedPromise.dueDate, function() {
                    res.sendStatus(200);
                });
            } catch (e) {
                commonUtils.handleException(e, res);
            }
        });

        app.get('/promises', checkAuthAsync, function(req, res) {
            var promises = promiseDao.getPromisesByUsername(req.session.username, function(promises) {
                userInstagramProfileDao.getProfile(req.session.username, function(userInstagramProfile) {

                    promises.forEach(function(promise) {
                        promise.tags = [];
                        var words = promise.description.split(" ");
                        words.forEach(function(word) {
                            if (word.indexOf('#') === 0) {
                                promise.tags.push(word.substr(1));
                            }
                        });
                    });

                    if (userInstagramProfile) {
                        instagramService.getRecentMedia(userInstagramProfile.token, function(result) {
                            result.data.forEach(function(recentMedia) {
                                if (recentMedia.tags.indexOf('completed') > -1) {
                                    promises.forEach(function(promise) {
                                        promise.tags.forEach(function(tag) {
                                            if (recentMedia.tags.indexOf(tag) > -1) {
                                                promise.attachment = recentMedia.images.standard_resolution.url;
                                                promise.status = constants.PROMISE_COMPLETED_VIA_INSTAGRAM;
                                            }
                                        });
                                    });
                                }
                            });
                            res.end(JSON.stringify(promises));
                        });
                    } else {
                        res.end(JSON.stringify(promises));
                    }
                });
            });
        });

        app.get('/promises/score', checkAuthAsync, function(req, res) {
            var promises = promiseDao.getScore(req.session.username, function(promises) {
                res.end(JSON.stringify(promises));
            });
        });

        app.post('/promises/:id/status', checkAuthAsync, function(req, res) {
            var promise = promiseDao.updatePromiseStatus(req.params.id, req.body.status, function() {
                res.sendStatus(200);
            });
        });

        var multipartMiddleware = multipart();
        app.post('/promises/:id/attachment', multipartMiddleware, function(req, res) {
            var promise = promiseDao.updatePromiseAttachment(req.params.id, req.files['file'].path, function() {
                res.sendStatus(200);
            });
        });

        app.get('/promises/:id/attachment', function(req, res) {
            var promise = promiseDao.getPromiseById(req.params.id, function(promise) {
                if (commonUtils.isHttpUrl(promise.attachment)) {
                    res.redirect(promise.attachment);
                } else {
                    res.sendFile(promise.attachment);
                }
            });
        });

        console.log('REST [%s] module initialized!', 'promise');

    }

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    }

});
