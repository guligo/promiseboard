var commonUtils = require('./../common-utils');

const PROMISE_DELETED = 0;
const PROMISE_COMMITED = 1;
const PROMISE_COMPLETED = 2;
const PROMISE_FAILED = 3;

var _promises = [
    {
        id: 1,
        username: 'guligo',
        description: 'I promise to myself...',
        status: PROMISE_COMMITED
    },
    {
        id: 2,
        username: 'guligo',
        description: 'I promise to myself...',
        status: PROMISE_COMMITED
    }
];

var _createPromise = function(username, description) {
    var id = _getMaxPromiseId() + 1;
    _promises.push({
        id: id,
        username: username,
        description: description,
        status: PROMISE_COMMITED
    });
}

var _updatePromise = function(id, description, status) {
    var promise = _getPromiseById(id);
    promise.status = status;
};

var _getPromiseById = function(id) {
    var resultingPromise;
    _promises.forEach(function(promise) {
        if (promise.id === id) {
            resultingPromise = promise;
        }
    });
    return resultingPromise;
}

var _getPromisesByUsername = function(username) {
    var resultingPromises = [];
    _promises.forEach(function(promise) {
        if (promise.status && promise.status !== PROMISE_DELETED && promise.username === username) {
            resultingPromises.push(promise);
        }
    });
    return resultingPromises;
}

var _getMaxPromiseId = function() {
    var resultingId = 0;
    _promises.forEach(function(promise) {
        if (promise.id > resultingId) {
            resultingId = promise.id;
        }
    });
    return resultingId;
}

module.exports = {
    createPromise: function(username, description) {
        _createPromise(username, description);
    },
    updatePromise: function(id, description, status) {
        _updatePromise(id, description, status);
    },
    getPromiseById: function(id) {
        return _getPromiseById(id);
    },
    getPromisesByUsername: function(username) {
        return _getPromisesByUsername(username);
    },
    getMaxPromiseId: function() {
        return _getMaxPromiseId();
    }
};
