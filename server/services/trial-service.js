define(['crypto', '../www/js/constantz', '../dao/user-dao', '../dao/promise-dao', '../dao/score-dao', '../www/js/date-utils'],
    function(crypto, constants, userDao, promiseDao, scoreDao, dateUtils) {

    var _getRandomToken = function() {
        return new Date().getTime() % (60 * 60 * 1000);
    };

    var _createTrialData = function(callback) {
        _createTrialUser(function(userDto) {
            _createTrialPromises(userDto, function() {
                if (callback) {
                    delete userDto.password;
                    callback(userDto);
                }
            });
        })
    };

    var _createTrialUser = function(callback) {
        var randomToken = _getRandomToken();

        var dto = {
            username: 'johndoe' + randomToken,
            plain: 'secret' + randomToken
        };

        dto.password = crypto.createHash('md5').update(dto.plain).digest("hex");
        userDao.createUser(dto, function() {
            if (callback) {
                callback(dto);
            }
        });
    };

    var _createTrialPromises = function(dto, callback) {
        var scoreDto = {
            score: 1
        };

        promiseDao.createPromise(dto.username, 'Test 1', undefined, dateUtils.getEndOfToday(), function(promiseId) {
            scoreDto.promiseId = promiseId;
            scoreDao.createScore(scoreDto, function() {
                promiseDao.createPromise(dto.username, 'Test 2', undefined, dateUtils.getEndOfTomorrow(), function(promiseId) {
                    scoreDto.promiseId = promiseId;
                    scoreDao.createScore(scoreDto, function() {
                        promiseDao.createPromise(dto.username, 'Test 3', undefined, dateUtils.getEndOfThisWeek(), function(promiseId) {
                            scoreDto.promiseId = promiseId;
                            scoreDao.createScore(scoreDto, function() {
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    });
                });
            });
        });
    };

    return {
        createTrialData: function(callback) {
            _createTrialData(callback);
        }
    };

});
