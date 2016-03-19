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

    var _handleClientException = function(e) {
        if (e.status === 401) {
            window.location.replace('/');
        }
    }

    var _isHttpUrl = function(url) {
        return url != undefined && (url.indexOf('http') === 0 || url.indexOf('https') === 0);
    }

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
        handleClientException: function(e) {
            _handleClientException(e);
        },
        isHttpUrl: function(url) {
            return _isHttpUrl(url);
        },
        stringToBoolean: function(str) {
            return _stringToBoolean(str);
        },
        round: function(number, places) {
            return _round(number, places);
        }
    };

});
