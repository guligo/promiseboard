require.config({
    baseUrl: 'js'
});

require(['constantz', 'controllers/user-controller', 'controllers/promise-controller', 'controllers/attachment-controller', 'common-utils'],
    function(constants, userController, promiseController, attachmentController, commonUtils) {

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

            var renderPromise = function(promise, user) {
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
                        refreshPromiseList();
                    });
                }

                if (Number(promise.status) === constants.PROMISE_COMMITED) {
                    $('#promise' + promise.id + ' .pb-infdef').attr('style', '');
                    $('#promise' + promise.id + ' .pb-promise-tags').addClass('pb-promise-tags-invisible');
                    if (user.hasInstagramProfile && promise.tag) {
                        $('#promise' + promise.id + ' .pb-promise-tags').removeClass('pb-promise-tags-invisible');
                        $('#promise' + promise.id + ' .pb-promise-tags .pb-promise-tag').text(promise.tag);
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

                    $('#promise' + promise.id + ' .pb-promise-date-label').text('Due:');
                    $('#promise' + promise.id + ' .pb-promise-date').text(
                        commonUtils.formatDate(new Date(promise.dueDate)) + ' ' +
                        '(' + commonUtils.calculateTimeLeft(new Date(promise.dueDate)) + ')'
                    );
                } else if (Number(promise.status) === constants.PROMISE_COMPLETED) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date-label').text('Completed at:');
                    $('#promise' + promise.id + ' .pb-promise-date').text(commonUtils.formatDate(new Date(promise.dueDate)));
                } else if (Number(promise.status) === constants.PROMISE_COMPLETED_VIA_INSTAGRAM) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date-label').html('Completed via <div class="btn btn-social-icon btn-instagram"><span class="fa fa-instagram"></span></div> at:');
                    $('#promise' + promise.id + ' .pb-promise-date').text(commonUtils.formatDate(new Date(promise.dueDate)));
                } else if (Number(promise.status) === constants.PROMISE_FAILED) {
                    $('#promise' + promise.id + ' .pb-status-completed').hide();
                    $('#promise' + promise.id + ' .pb-status-failed').hide();

                    $('#promise' + promise.id + ' .pb-promise-date-label').text('Due date:');
                    $('#promise' + promise.id + ' .pb-promise-date').text(commonUtils.formatDate(new Date(promise.dueDate)));
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
                var numberOfPromisesCompleted = 0;
                var numberOfPromisesFailed = 0;

                promises.forEach(function(promise) {
                    var status = Number(promise.status);
                    if (status === constants.PROMISE_COMMITED) {
                        numberOfPromisesCommited++;
                    } else if (status === constants.PROMISE_COMPLETED || status === constants.PROMISE_COMPLETED_VIA_INSTAGRAM) {
                        numberOfPromisesCompleted++;
                    } else if (status === constants.PROMISE_FAILED) {
                        numberOfPromisesFailed++;
                    }
                });

                $('#numberOfPromisesCommited').text(numberOfPromisesCommited);
                $('#numberOfPromisesCompleted').text(numberOfPromisesCompleted);
                $('#numberOfPromisesFailed').text(numberOfPromisesFailed);
            };

            var refreshPromiseList = function(user, filter) {
                $('#promiseList').html('<div class="pb-promise-list-loader"><img src="img/loader.gif" /></div>');

                promiseController.getPromises(function(promises) {
                    $('#promiseList').empty();
                    refreshStatistics(promises);
                    if (promises.length > 0) {
                        promises.forEach(function(promise) {
                            if (Number(promise.status) !== constants.PROMISE_DELETED
                                && (!filter || filter && filter(Number(promise.status)))) {
                                renderPromise(promise, user);
                            }
                        });
                    } else {
                        $('#promiseList').html('<div class="pb-promise-list-empty"><span>Go ahead and commit some promise or resolution!</span></div>');
                    }
                });

                promiseController.getScore(function(score) {
                    if (score.points === constants.POINTS_TERRIBLE) {
                        $('#score').attr('src', '/css/adam-whitcroft-climacons/cloud-lightning.svg');
                    } else if (score.points === constants.POINTS_BAD) {
                        $('#score').attr('src', '/css/adam-whitcroft-climacons/cloud-drizzle.svg');
                    } else if (score.points === constants.POINTS_NEUTRAL) {
                        $('#score').attr('src', '/css/adam-whitcroft-climacons/cloud.svg');
                    } else if (score.points === constants.POINTS_GOOD) {
                        $('#score').attr('src', '/css/adam-whitcroft-climacons/cloud-sun.svg');
                    } else if (score.points === constants.POINTS_EXCELLENT) {
                        $('#score').attr('src', '/css/adam-whitcroft-climacons/sun.svg');
                    }
                });
            }

            var selectedDate;

            $('#createPromiseModal').on('shown.bs.modal', function() {
                $('#createPromiseModalTagGroup').addClass('pb-invisible');
                if (user.hasInstagramProfile) {
                    $('#createPromiseModalTagGroup').removeClass('pb-invisible');
                }
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
                    refreshPromiseList(user);
                }, function(text) {
                    $('#createPromiseModalDescriptionGroup').addClass('has-error');
                    $('#createPromiseModalDescriptionLabel').text(text);
                });
            });

            var clearCreatePromiseModal = function() {
                $('#createPromiseModalDescriptionGroup').removeClass('has-error');
                $('#createPromiseModalDescriptionField').val('');
                $('#createPromiseModalDueDate').text('');
                $('#createPromiseModalTagField').val('');
                $('#createPromiseModalTagDescription').attr('style', 'display: none;');
            }

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