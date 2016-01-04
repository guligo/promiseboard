const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

var pg = require('pg');

var _init = function(callback) {
    console.log('Initializing user DAO, database connection URL = [' + process.env.DATABASE_URL + ']');

    pg.connect(DATABASE_URL, function(err, client) {
        if (err) throw err;

        client
            .query('CREATE TABLE IF NOT EXISTS users(username VARCHAR(30) PRIMARY KEY, password VARCHAR(30) not null);')
            .on('end', function(result) {
                if (callback) {
                    callback();
                }
            });
    });
}

var _createUser = function(username, password, callback) {
    console.log('Creating user with username = [' + username + ']');

    pg.connect(DATABASE_URL, function(err, client) {
        if (err) throw err;

        client
            .query('INSERT INTO users (username, password) VALUES($1, $2);', [username, password])
            .on('end', function(result) {
                callback();
            });
    });
}

var _getUserByUsername = function(username, callback) {
    console.log('Getting user by username = [' + username + ']');

    pg.connect(DATABASE_URL, function(err, client) {
        if (err) throw err;

        client
            .query('SELECT * FROM users WHERE username = $1 LIMIT 1;', [username])
            .on('row', function(row) {
                callback(row);
            })
            .on('end', function(result) {
                if (result.rowCount === 0) {
                    callback();
                }
            });
    });
}

module.exports = {
    init: function() {
        _init();
    },
    createUser: function (username, password, callback) {
        _createUser(username, password, callback);
    },
    getUserByUsername: function (username, callback) {
        _getUserByUsername(username, callback);
    }
};
