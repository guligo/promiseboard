const PROMISE_DELETED = 0;
const PROMISE_COMMITED = 1;
const PROMISE_COMPLETED = 2;
const PROMISE_FAILED = 3;

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

var pg = require('pg');

var commonUtils = require('./../common-utils');

var _promises = [
    {
        id: 1,
        username: 'guligo',
        description: 'To do something cool.',
        dueDate: new Date(),
        status: PROMISE_COMMITED
    },
    {
        id: 2,
        username: 'guligo',
        description: 'To do something really cool.',
        dueDate: new Date(),
        status: PROMISE_COMMITED
    }
];

var _init = function(callback) {
    console.log('Initializing promise DAO, database connection URL = [' + DATABASE_URL + ']');

    pg.connect(DATABASE_URL, function(err, client) {
        if (err) throw err;

        client
            .query('CREATE TABLE IF NOT EXISTS \
                promises (\
                    id SERIAL PRIMARY KEY, \
                    username VARCHAR(30) NOT NULL REFERENCES users (username), \
                    description TEXT NOT NULL, \
                    due_date TIMESTAMP NOT NULL, \
                    status INTEGER NOT NULL \
                );')
            .on('end', function(result) {
                console.log('Creation of [promises] table completed!');

                if (callback) {
                    callback();
                }
            });
    });
}

var _createPromise = function(username, description, dueDate) {
    var id = _getMaxPromiseId() + 1;
    _promises.push({
        id: id,
        username: username,
        description: description,
        dueDate: dueDate,
        status: PROMISE_COMMITED
    });
}

var _createPromiseAttachment = function(id, attachment) {
    var promise = _getPromiseById(id);
    promise.attachment = attachment;
}

var _updatePromise = function(id, description, dueDate, status) {
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
    init: function(callback) {
        _init(callback);
    },
    createPromise: function(username, description, dueDate) {
        _createPromise(username, description, new Date(dueDate));
    },
    updatePromise: function(id, description, dueDate, status) {
        _updatePromise(Number(id), description, new Date(dueDate), Number(status));
    },
    createPromiseAttachment: function(id, attachment) {
        _createPromiseAttachment(Number(id), attachment);
    },
    getPromiseById: function(id) {
        return _getPromiseById(Number(id));
    },
    getPromisesByUsername: function(username) {
        return _getPromisesByUsername(username);
    },
    getMaxPromiseId: function() {
        return _getMaxPromiseId();
    }
};
