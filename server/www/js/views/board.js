require.config({
    baseUrl: 'js'
});

require(['constantz', 'controllers/user-controller', 'controllers/promise-controller', 'controllers/attachment-controller', 'controllers/score-controller', 'common-utils'],
    function(constants, userController, promiseController, attachmentController, scoreController, commonUtils) {

    $(document).ready(function() {
        $('#logoutLink').click(function() {
            userController.logOut(function() {
                window.location.replace('index.html');
            });
        });

        $('#settingsLink').click(function() {
            window.location.replace('settings.html');
        });

        userController.getMe(function(user) {
            $('#username').text(user.username);

            var renderPromise = function(promise, user, infdef) {
                var promiseElement = $('.pb-promise-wrapper');
                promiseElement.find('.pb-promise-description').text(promise.description);

                attachmentController.hasAttachment({id: promise.id}, function(result) {
                    if (result.flag === true) {
                        $('#promise' + promise.id + ' .pb-promise-attachment').attr('style', '');
                        $('#promise' + promise.id + ' .pb-promise-attachment-content').html('<img src="attachment/' + promise.id + '/data" />');
                    } else {
                        $('#promise' + promise.id + ' .pb-promise-attachment').attr('style', 'display: none;');
                        $('#promise' + promise.id + ' .pb-promise-attachment-content').html('<span>None</span>');
                    }
                });

                $('#promiseList').append(promiseElement.prop('outerHTML').replace('class="pb-promise-wrapper"', 'id="promise' + promise.id + '"'));

                $('#promise' + promise.id + ' .pb-infdef').attr('style', 'display: none;');
                if (Number(promise.status) === constants.PROMISE_COMMITED) {
                    $('#promise' + promise.id + ' .pb-promise').addClass('alert-warning');
                } else if (Number(promise.status) === constants.PROMISE_COMPLETED
                    || Number(promise.status) === constants.PROMISE_COMPLETED_VIA_INSTAGRAM) {
                    $('#promise' + promise.id + ' .pb-promise').addClass('alert-success');
                } else if (Number(promise.status) === constants.PROMISE_FAILED) {
                    $('#promise' + promise.id + ' .pb-promise').addClass('alert-danger');
                }

                var updatePromiseStatus = function(status, onSuccess) {
                    promiseController.updatePromiseStatus({
                        id: promise.id,
                        status: status
                    }, function() {
                        onSuccess();
                        $('#showPromisesCommited').click();
                    });
                }

                if (Number(promise.status) === constants.PROMISE_COMMITED) {
                    $('#promise' + promise.id + ' .pb-promise-tags').addClass('pb-promise-tags-invisible');
                    if (user.hasInstagramProfile && promise.tag) {
                        $('#promise' + promise.id + ' .pb-promise-tags').removeClass('pb-promise-tags-invisible');
                        $('#promise' + promise.id + ' .pb-promise-tags .pb-promise-tag').text(promise.tag);
                    }

                    if (infdef) {
                        $('#promise' + promise.id + ' .pb-infdef').attr('style', '');
                        $('#promise' + promise.id + ' .pb-inflate').click(function() {
                            scoreController.inflate({
                                promiseId: promise.id
                            }, function() {
                                $('#showPromisesCommited').click();
                            });
                        });
                        $('#promise' + promise.id + ' .pb-deflate').click(function() {
                            scoreController.deflate({
                                promiseId: promise.id
                            }, function() {
                                $('#showPromisesCommited').click();
                            });
                        });
                    }

                    $('#promise' + promise.id + ' .pb-status-completed').click(function() {
                        $('#promiseCompletionModal').modal('show');
                        $('#promiseCompletionModalOkButton').off();
                        $('#promiseCompletionModalOkButton').click(function() {
                            if ($('#promiseCompletionModalAttachment')[0].files.length > 0) {
                                var formData = new FormData();
                                formData.append('file', $('#promiseCompletionModalAttachment')[0].files[0]);

                                promiseController.updatePromiseAttachment({
                                        id: promise.id
                                    },
                                    formData, function() {
                                        updatePromiseStatus(constants.PROMISE_COMPLETED, function() {
                                            $('#promiseCompletionModal').modal('hide');
                                        });
                                    }
                                );
                            } else {
                                updatePromiseStatus(constants.PROMISE_COMPLETED, function() {
                                    $('#promiseCompletionModal').modal('hide');
                                });
                            }
                        });
                    });

                    $('#promise' + promise.id + ' .pb-status-failed').click(function() {
                        $('#promiseFailureModal').modal('show');
                        $('#promiseFailureModalOkButton').off();
                        $('#promiseFailureModalOkButton').click(function() {
                            updatePromiseStatus(constants.PROMISE_FAILED, function() {
                                $('#promiseFailureModal').modal('hide');
                            });
                        });
                    });

                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label');
                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label-default');
                    $('#promise' + promise.id + ' .pb-promise-date').text(commonUtils.calculateTimeLeft(new Date(promise.dueDate)) + ' left');
                } else if (Number(promise.status) === constants.PROMISE_COMPLETED) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label');
                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label-success');
                    $('#promise' + promise.id + ' .pb-promise-date').text('Completed at ' + commonUtils.formatDate(new Date(promise.statusChangeDate)));
                } else if (Number(promise.status) === constants.PROMISE_COMPLETED_VIA_INSTAGRAM) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label');
                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label-success');
                    $('#promise' + promise.id + ' .pb-promise-date').text('Completed at ' + commonUtils.formatDate(new Date(promise.statusChangeDate)) + ' via Insta');
                } else if (Number(promise.status) === constants.PROMISE_FAILED) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label');
                    $('#promise' + promise.id + ' .pb-promise-date').addClass('label-danger');
                    $('#promise' + promise.id + ' .pb-promise-date').text('Due date was ' + commonUtils.formatDate(new Date(promise.statusChangeDate)));
                }

                $('#promise' + promise.id + ' .pb-status-removed').click(function() {
                    $('#promiseRemovalModal').modal('show');
                    $('#promiseRemovalModalOkButton').off();
                    $('#promiseRemovalModalOkButton').click(function() {
                        updatePromiseStatus(constants.PROMISE_DELETED, function() {
                            $('#promiseRemovalModal').modal('hide');
                        });
                    });
                });
            }

            var refreshStatistics = function(promises) {
                var numberOfPromisesCommited = 0;
                promises.forEach(function(promise) {
                    var status = Number(promise.status);
                    if (status === constants.PROMISE_COMMITED) {
                        numberOfPromisesCommited++;
                    }
                });
                $('#numberOfPromisesCommited').text(numberOfPromisesCommited);

                scoreController.getScoreByPromiseStatus({status: constants.PROMISE_COMPLETED}, function(promiseCompletedScore) {
                    scoreController.getScoreByPromiseStatus({status: constants.PROMISE_COMPLETED_VIA_INSTAGRAM}, function(promiseCompletedViaInstagramScore) {
                        promiseCompletedScore.score += promiseCompletedViaInstagramScore.score;
                        scoreController.getScoreByPromiseStatus({status: constants.PROMISE_FAILED}, function(promiseFailedScore) {
                            $('#numberOfPromisesCompleted').text(promiseCompletedScore.score);
                            $('#numberOfPromisesFailed').text(promiseFailedScore.score);

                            var points = promiseCompletedScore.score / (promiseCompletedScore.score + promiseFailedScore.score);
                            if (points <= constants.POINTS_TERRIBLE) {
                                $('#score').html('<img class="navbar-brand pb-brand-score" src="/css/adam-whitcroft-climacons/cloud-lightning.svg"></img>');
                            } else if (points <= constants.POINTS_BAD) {
                                $('#score').html('<img class="navbar-brand pb-brand-score" src="/css/adam-whitcroft-climacons/cloud-drizzle.svg"></img>');
                            } else if (points <= constants.POINTS_NEUTRAL) {
                                $('#score').html('<img class="navbar-brand pb-brand-score" src="/css/adam-whitcroft-climacons/cloud.svg"></img>');
                            } else if (points <= constants.POINTS_GOOD) {
                                $('#score').html('<img class="navbar-brand pb-brand-score" src="/css/adam-whitcroft-climacons/cloud-sun.svg"></img>');
                            } else if (points <= constants.POINTS_EXCELLENT) {
                                $('#score').html('<img class="navbar-brand pb-brand-score" src="/css/adam-whitcroft-climacons/sun.svg"></img>');
                            }
                            $('#score').attr('title', 'Completion ratio: ' + commonUtils.round(points, 2));
                        });
                    });
                });
            };

            var refreshPromiseList = function(user, filter) {
                $('#promiseList').html('<div class="pb-promise-list-loader"><img src="img/loader.gif" /></div>');

                promiseController.getPromises(function(promises) {
                    $('#promiseList').empty();
                    refreshStatistics(promises);
                    scoreController.getLatestScoreDate(function(scoreDate) {
                        var infdef = false;
                        var deltaTime = 0;
                        if (!scoreDate.date || (deltaTime = new Date().getTime() - new Date(scoreDate.date).getTime()) >= 60 * 60 * 1000) {
                            $('#scorePool span').html('Allocate 1 point');
                            infdef = true;
                        } else {
                            $('#scorePool span').html((60 - Math.round(deltaTime / 60 / 1000)) + ' min. left');
                        }

                        var filteredPromiseCount = 0;
                        if (promises.length > 0) {
                            promises.forEach(function(promise) {
                                if (Number(promise.status) !== constants.PROMISE_DELETED
                                    && (!filter || filter && filter(Number(promise.status)))) {
                                    renderPromise(promise, user, infdef);
                                    filteredPromiseCount++;
                                }
                            });
                            if (filteredPromiseCount === 0) {
                                $('#promiseList').html('<div class="pb-promise-list-empty"><span>Promise list is empty</span></div>');
                            }
                        } else {
                            $('#promiseList').html('<div class="pb-promise-list-empty"><span>Go ahead and commit some promise or resolution!</span></div>');
                        }
                    });
                });
            }

            var selectedDate;

            $('#createPromiseModal').on('shown.bs.modal', function() {
                $('#createPromiseModalTagGroup').addClass('pb-invisible');
                if (user.hasInstagramProfile) {
                    $('#createPromiseModalTagGroup').removeClass('pb-invisible');
                }
            });

            $('#createPromiseModalDueDateInOneMinute').click(function() {
                selectedDate = new Date(Date.now() + 60 * 1000);
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(selectedDate));
            });

            $('#createPromiseModalDueDateToday').click(function() {
                var endOfToday = new Date();
                endOfToday.setHours(23);
                endOfToday.setMinutes(59);
                endOfToday.setSeconds(59);
                endOfToday.setMilliseconds(999);

                selectedDate = endOfToday;
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(endOfToday));
            });

            $('#createPromiseModalDueDateTomorrow').click(function() {
                var endOfTomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                endOfTomorrow.setHours(23);
                endOfTomorrow.setMinutes(59);
                endOfTomorrow.setSeconds(59);
                endOfTomorrow.setMilliseconds(999);

                selectedDate = endOfTomorrow;
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(endOfTomorrow));
            });

            $('#createPromiseModalDueDateThisWeek').click(function() {
                var today = new Date();

                var startOfThisWeek = new Date(today.getTime() - ((today.getDay() - 1 >= 0 ? today.getDay() - 1 : 6) * 24 * 60 * 60  * 1000));
                startOfThisWeek.setHours(0);
                startOfThisWeek.setMinutes(0);
                startOfThisWeek.setSeconds(0);
                startOfThisWeek.setMilliseconds(0);

                var endOfThisWeek = new Date(startOfThisWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
                selectedDate = endOfThisWeek;
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(endOfThisWeek));
            });

            $('#createPromiseModalDueDateThisMonth').click(function() {
                var startOfNextMonth = new Date();
                startOfNextMonth.setMonth((startOfNextMonth.getMonth() + 1) % 12);
                startOfNextMonth.setDate(1);
                startOfNextMonth.setHours(0);
                startOfNextMonth.setMinutes(0);
                startOfNextMonth.setSeconds(0);
                startOfNextMonth.setMilliseconds(0);

                var endOfThisMonth = new Date(startOfNextMonth.getTime() - 1);
                selectedDate = endOfThisMonth;
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(endOfThisMonth));
            });

            $('#createPromiseModalDueDateThisYear').click(function() {
                var startOfNextYear = new Date();
                startOfNextYear.setFullYear(startOfNextYear.getFullYear() + 1);
                startOfNextYear.setMonth(0);
                startOfNextYear.setDate(1);
                startOfNextYear.setHours(0);
                startOfNextYear.setMinutes(0);
                startOfNextYear.setSeconds(0);
                startOfNextYear.setMilliseconds(0);

                var endOfThisYear = new Date(startOfNextYear.getTime() - 1);
                selectedDate = endOfThisYear;
                $('#createPromiseModalDueDate').text(commonUtils.formatDate(endOfThisYear));
            });

            $('#createPromiseModalTagField').on('change keyup paste', function() {
                if ($('#createPromiseModalTagField').val() && $('#createPromiseModalTagField').val() !== '') {
                    $('#createPromiseModalTagValue').text($('#createPromiseModalTagField').val());
                    $('#createPromiseModalTagDescription').attr('style', '');
                } else {
                    $('#createPromiseModalTagDescription').attr('style', 'display: none;');
                }
            });

            $('#createPromiseModalCreateButton').click(function() {
                promiseController.createPromise({
                    description: $('#createPromiseModalDescriptionField').val(),
                    tag: $('#createPromiseModalTagField').val(),
                    dueDate: selectedDate
                }, function() {
                    $('#createPromiseModalCloseButton').click();
                    $('#showPromisesCommited').click();
                }, function(error) {
                    if (error.field === 'description') {
                        $('#createPromiseModalDescriptionGroup').addClass('has-error');
                        $('#createPromiseModalDescriptionLabel').text(error.text);
                    } else if (error.field == 'tag') {
                        $('#createPromiseModalTagGroup').addClass('has-error');
                        $('#createPromiseModalTagLabel').text(error.text);
                    }
                });
            });

            var clearCreatePromiseModal = function() {
                $('#createPromiseModalDescriptionLabel').text('Description');
                $('#createPromiseModalDescriptionGroup').removeClass('has-error');
                $('#createPromiseModalDescriptionField').val('');
                $('#createPromiseModalDueDate').text('');
                $('#createPromiseModalTagLabel').text('');
                $('#createPromiseModalTagGroup').removeClass('has-error');
                $('#createPromiseModalTagField').val('');
                $('#createPromiseModalTagDescription').attr('style', 'display: none;');
            };

            $('#createPromiseModal').on('hidden.bs.modal', function () {
                clearCreatePromiseModal();
            });

            $('#showPromisesCommited').click(function() {
                refreshPromiseList(user, function(status) {
                    return status === constants.PROMISE_COMMITED
                });
            });

            $('#showPromisesCompleted').click(function() {
                refreshPromiseList(user, function(status) {
                    return status === constants.PROMISE_COMPLETED
                        || status === constants.PROMISE_COMPLETED_VIA_INSTAGRAM
                });
            });

            $('#showPromisesFailed').click(function() {
                refreshPromiseList(user, function(status) {
                    return status === constants.PROMISE_FAILED
                });
            });

            refreshPromiseList(user, function(status) {
                return status === constants.PROMISE_COMMITED
            });
        });
    });
});
