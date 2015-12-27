var _clone = function(object) {
    return JSON.parse(JSON.stringify(object));
}

var _createException = function(text) {
    return {
        checked: true,
        text: text
    };
}

module.exports = {
    clone: function(object) {
        return _clone(object);
    },
    createException: function(text) {
        return _createException(text);
    }
}
