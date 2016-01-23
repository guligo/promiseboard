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
        }
    }

});
