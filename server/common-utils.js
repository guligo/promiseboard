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

module.exports = {
    createException: function(text) {
        return _createException(text);
    },
    handleException: function(e, res) {
        return _handleException(e, res);
    }
}
