var _clone = function(object) {
    return JSON.parse(JSON.stringify(object));
}

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
    clone: function(object) {
        return _clone(object);
    },
    createException: function(text) {
        return _createException(text);
    },
    handleException: function(e, res) {
        return _handleException(e, res);
    }
}
