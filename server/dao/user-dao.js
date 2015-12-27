var commonUtils = require('./../common-utils');

var _users = [
    {
        username: 'guligo',
        password: 'qwerty'
    }
];

var _createUser = function(username, password) {
    _users.push({
        username: username,
        password: password
    });
}

var _getUsers = function() {
    var users = commonUtils.clone(_users);
    users.forEach(function(user) {
        user.password = '****';
    });
    return users;
}

var _getUserByUsername = function(username) {
    var resultingUser;
    _users.forEach(function(user) {
        if (user.username === username) {
            resultingUser = user;
        }
    });
    return resultingUser;
}

module.exports = {
    createUser: function (username, password) {
        _createUser(username, password);
    },
    getUsers: function () {
        return _getUsers();
    },
    getUserByUsername: function (username) {
        return _getUserByUsername(username);
    }
};
