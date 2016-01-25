define(function() {

    var _createException = function(text) {
        return {
            checked: true,
            text: text
        };
    }

    var _handleException = function(e, res) {
        console.error(e);
        if (e.checked === true) {
            res.status(500).send(e.text);
        } else {
            res.sendStatus(500);
        }
    }

    var _formatDate = function(date) {
        if (date) {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' +
                date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
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

    return {
        createException: function(text) {
            return _createException(text);
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
        }
    }

});
