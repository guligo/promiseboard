define(['request', '../www/js/constantz', '../www/js/common-utils', '../dao/promise-dao', '../dao/user-profile-dao', '../dao/attachment-dao', '../dao/score-dao', '../services/instagram-service'],
    function(request, constants, commonUtils, promiseDao, userProfileDao, attachmentDao, scoreDao, instagramService) {

    var _getDataFromUrl = function(url, callback) {
        request.defaults({ encoding: null }).get(url, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                if (callback) {
                    callback(data);
                }
            }
        });
    };

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module', 'promise');

        app.post('/promises', checkAuthAsync, function(req, res) {
            userProfileDao.getInstagramProfile(req.session.username, function(instagramProfile) {
                try {
                    var submittedPromise = req.body;

                    if (submittedPromise.description === undefined || submittedPromise.description.length === 0) {
                        throw commonUtils.createException('Description is empty', 'description');
                    } else if (submittedPromise.description.length > 140) {
                        throw commonUtils.createException('Maximum description length is 140 characters', 'description');
                    } else if (submittedPromise.dueDate === undefined || submittedPromise.dueDate.length == 0) {
                        throw commonUtils.createException('Due date is empty', 'description');
                    } else if (instagramProfile && submittedPromise.tag) {
                        if (submittedPromise.tag.length > 0 && submittedPromise.tag.length < 3) {
                            throw commonUtils.createException('Minimum tag length is 3 characters', 'tag');
                        } else if (submittedPromise.tag.length > 30) {
                            throw commonUtils.createException('Maximum tag length is 30 characters', 'tag');
                        } else if (!submittedPromise.tag.match(/^[a-zA-Z0-9]+$/g)) {
                            throw commonUtils.createException('Tag value may not contain special characters', 'tag');
                        }
                    }

                    promiseDao.createPromise(req.session.username, submittedPromise.description, submittedPromise.tag ? 'ipromise' + submittedPromise.tag : undefined, submittedPromise.dueDate, function(id) {
                        scoreDao.createScore({promiseId: id, score: 1}, function() {
                            res.sendStatus(200);
                        });
                    });
                } catch (e) {
                    commonUtils.handleException(e, res);
                }
            });
        });

        var _updatePromiseStatusToCompletedViaInstagramIfRequired = function(promise, recentMedia) {
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
            }
        };

        var _updatePromiseStatusToFailedIfRequired = function(promise) {
            if (promise.status === constants.PROMISE_COMMITED
                && commonUtils.dateAfter(new Date(), promise.dueDate)) {
                promise.status = constants.PROMISE_FAILED;
            }
        };

        app.get('/promises', checkAuthAsync, function(req, res) {
            promiseDao.getPromisesByUsername(req.session.username, function(promises) {
                userProfileDao.getInstagramProfile(req.session.username, function(userInstagramProfile) {
                    if (userInstagramProfile) {
                        instagramService.getRecentMedia(userInstagramProfile.token, function(result) {
                            promises.forEach(function(promise) {
                                result.data.forEach(function(recentMedia) {
                                    _updatePromiseStatusToCompletedViaInstagramIfRequired(promise, recentMedia);
                                    _updatePromiseStatusToFailedIfRequired(promise);
                                });
                            });

                            promiseDao.updatePromiseStatuses(promises, function() {
                                res.end(JSON.stringify(promises));
                            });
                        });
                    } else {
                        promises.forEach(function(promise) {
                            _updatePromiseStatusToFailedIfRequired(promise);
                        });

                        promiseDao.updatePromiseStatuses(promises, function() {
                            res.end(JSON.stringify(promises));
                        });
                    }
                });
            });
        });

        app.post('/promises/:id/status', checkAuthAsync, function(req, res) {
            promiseDao.updatePromiseStatus(req.params.id, req.body.status, function() {
                res.sendStatus(200);
            });
        });
    };

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    };

});
