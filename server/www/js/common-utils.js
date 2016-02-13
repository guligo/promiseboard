define(function() {

    var _createException = function(text, field) {
        return {
            checked: true,
            text: text,
            field: field
        };
    }

    var _handleException = function(e, res) {
        console.error(e);
        if (e.checked === true) {
            if (!e.field) {
                res.status(500).send(e.text);
            } else {
                res.status(500).send(JSON.stringify(e));
            }
        } else {
            res.sendStatus(500);
        }
    }

    var _format = function(number, length) {
        var result = number + '';
        while (result.length < length) {
            result = '0' + result;
        }
        return result;
    }

    var _formatDate = function(date) {
        if (date) {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' +
                _format(date.getHours(), 2) + ':' + _format(date.getMinutes(), 2) + ':' + _format(date.getSeconds(), 2);
        } else {
            return '<unknown>';
        }
    }

    var _isHttpUrl = function(url) {
        return url != undefined && (url.indexOf('http') === 0 || url.indexOf('https') === 0);
    }

    var _calculateTimeLeft = function(dueDate) {
        var timeLeft = dueDate.getTime() - new Date().getTime();

        var millisecondsInDay = 24 * 60 * 60 * 1000;
        var millisecondsInHour = 60 * 60 * 1000;
        var millisecondsInMinute = 60 * 1000;

        var delta = timeLeft - timeLeft % millisecondsInDay;
        var daysLeft = delta / millisecondsInDay;

        delta = timeLeft - daysLeft * millisecondsInDay;
        delta = delta - delta % millisecondsInHour;
        var hoursLeft = delta / millisecondsInHour;

        delta = timeLeft - daysLeft * millisecondsInDay - hoursLeft * millisecondsInHour;
        delta = delta - delta % millisecondsInMinute;
        var minutesLeft = delta / millisecondsInMinute;

        return daysLeft + ' days, ' + hoursLeft + ' hours, ' + minutesLeft + ' minutes';
    }

    var _dateBefore = function(date1, date2) {
        return date1.getTime() < date2.getTime();
    };

    var _dateBeforeOrEquals = function(date1, date2) {
        return _dateBefore(date1, date2) || _dateEquals(date1, date2);
    };

    var _dateAfter = function(date1, date2) {
        return date1.getTime() > date2.getTime();
    };

    var _dateAfterOrEquals = function(date1, date2) {
        return _dateAfter(date1, date2) || _dateEquals(date1, date2);
    };

    var _dateEquals = function(date1, date2) {
        return date1.getTime() === date2.getTime();
    };

    var _stringToBoolean = function(str) {
        return str === 'true';
    };

    var _round = function(number, places) {
        var multiplier = Math.pow(10, places);
        return Math.round(number * multiplier) / multiplier;
    };

    return {
        createException: function(text, field) {
            return _createException(text, field);
        },
        handleException: function(e, res) {
            return _handleException(e, res);
        },
        formatDate: function(date) {
            return _formatDate(date);
        },
        isHttpUrl: function(url) {
            return _isHttpUrl(url);
        },
        calculateTimeLeft: function(dueDate) {
            return _calculateTimeLeft(dueDate);
        },
        dateBefore: function(date1, date2) {
            return _dateBefore(date1, date2);
        },
        dateBeforeOrEquals: function(date1, date2) {
            return _dateBeforeOrEquals(date1, date2);
        },
        dateAfter: function(date1, date2) {
            return _dateAfter(date1, date2);
        },
        dateAfterOrEquals: function(date1, date2) {
            return _dateAfterOrEquals(date1, date2);
        },
        dateEquals: function(date1, date2) {
            return _dateEquals(date1, date2);
        },
        stringToBoolean: function(str) {
            return _stringToBoolean(str);
        },
        round: function(number, places) {
            return _round(number, places);
        }
    };

});
