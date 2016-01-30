define(['request', '../www/js/constantz', '../www/js/common-utils', '../dao/promise-dao', '../dao/user-instagram-profile-dao', '../dao/attachment-dao', '../services/instagram-service'],
    function(request, constants, commonUtils, promiseDao, userInstagramProfileDao, attachmentDao, instagramService) {

    var _getDataFromUrl = function(url, callback) {
        request.defaults({ encoding: null }).get(url, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                if (callback) {
                    callback(data);
                }
            }
        });
    }

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module...', 'promise');

        app.post('/promises', checkAuthAsync, function(req, res) {
            userInstagramProfileDao.getProfile(req.session.username, function(userInstagramProfile) {
                try {
                    var submittedPromise = req.body;

                    if (submittedPromise.description === undefined || submittedPromise.description.length <= 0) {
                        throw commonUtils.createException('Description is empty');
                    }
                    if (submittedPromise.dueDate === undefined || submittedPromise.dueDate.length == 0) {
                        throw commonUtils.createException('Due date is empty');
                    }
                    if (userInstagramProfile != undefined && (submittedPromise.tag == undefined || submittedPromise.tag.length == 0)) {
                        throw commonUtils.createException('Tag is empty');
                    }

                    promiseDao.createPromise(req.session.username, submittedPromise.description, submittedPromise.tag ? 'ipromise' + submittedPromise.tag : undefined, submittedPromise.dueDate, function() {
                        res.sendStatus(200);
                    });
                } catch (e) {
                    commonUtils.handleException(e, res);
                }
            });
        });

        app.get('/promises', checkAuthAsync, function(req, res) {
            promiseDao.getPromisesByUsername(req.session.username, function(promises) {
                userInstagramProfileDao.getProfile(req.session.username, function(userInstagramProfile) {
                    if (userInstagramProfile) {
                        instagramService.getRecentMedia(userInstagramProfile.token, function(result) {
                            promises.forEach(function(promise) {
                                result.data.forEach(function(recentMedia) {
                                    var recentMediaCreationDate = new Date(Number(recentMedia.caption.created_time  * 1000));

                                    if (recentMedia.tags.indexOf(promise.tag) > -1
                                        && recentMedia.tags.indexOf('promiseboard') > -1
                                        && commonUtils.dateBeforeOrEquals(promise.creationDate, recentMediaCreationDate)
                                        && commonUtils.dateBeforeOrEquals(new Date(), promise.dueDate)) {

                                        _getDataFromUrl(recentMedia.images.standard_resolution.url, function(data) {
                                            attachmentDao.createAttachment({
                                                promiseId: promise.id,
                                                data: data
                                            });
                                        });
                                        promise.status = constants.PROMISE_COMPLETED_VIA_INSTAGRAM;
                                    } else if (promise.status === constants.PROMISE_COMMITED
                                        && commonUtils.dateAfter(new Date(), promise.dueDate)) {

                                        promise.status = constants.PROMISE_FAILED;
                                    }
                                });
                            });

                            promiseDao.updatePromiseStatuses(promises, function() {
                                res.end(JSON.stringify(promises));
                            });
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
            promiseDao.updatePromiseStatus(req.params.id, req.body.status, function() {
                res.sendStatus(200);
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
