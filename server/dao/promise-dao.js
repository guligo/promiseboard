define(['pg', '../public/js/constantz'], function(pg, constants) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing promise DAO, database connection URL = [%s]', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    promises (\
                        id SERIAL PRIMARY KEY, \
                        username VARCHAR(30) NOT NULL REFERENCES users (username), \
                        description TEXT NOT NULL, \
                        due_date TIMESTAMP NOT NULL, \
                        status INTEGER NOT NULL, \
                        attachment TEXT \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [promises] table completed!');

                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _createPromise = function(username, description, dueDate, callback) {
        console.log('Creating promise for username = [%s] with description = [%s], dueData = [%s]', username, description, dueDate);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    promises (username, description, due_date, status) \
                    VALUES ($1, $2, $3, $4);',
                    [username, description, dueDate, constants.PROMISE_COMMITED])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _createPromiseAttachment = function(id, attachment, callback) {
        console.log('Creating attachment = [%s] for promise with id = [%s]', attachment, id);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('UPDATE promises \
                    SET attachment = $2 \
                    WHERE id = $1;',
                    [id, attachment])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _updatePromiseStatus = function(id, status, callback) {
        console.log('Updating status of promise with id = [%s] to status = [%s]', id, status);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('UPDATE promises \
                    SET status = $2 \
                    WHERE id = $1;',
                    [id, status])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    var _getPromiseById = function(id, callback) {
        console.log('Getting promise with id = [%s]', id);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingPromise;
            client
                .query('SELECT * \
                    FROM promises \
                    WHERE id = $1 \
                    LIMIT 1;',
                    [id])
                .on('row', function(row) {
                    resultingPromise = row;
                })
                .on('end', function(result) {
                    if (callback) {
                        callback(resultingPromise);
                    }
                    client.end();
                });
        });
    }

    var _getPromisesByUsername = function(username, callback) {
        console.log('Getting promises for username = [%s]', username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingPromises = [];
            client
                .query('SELECT * \
                    FROM promises \
                    WHERE username = $1;',
                    [username])
                .on('row', function(promise) {
                    resultingPromises.push(promise);
                })
                .on('end', function(result) {
                    if (callback) {
                        callback(resultingPromises);
                    }
                    client.end();
                });
        });
    }

    return {
        init: function(callback) {
            _init(callback);
        },
        createPromise: function(username, description, dueDate, callback) {
            _createPromise(username, description, new Date(dueDate), callback);
        },
        updatePromiseStatus: function(id, status, callback) {
            _updatePromiseStatus(Number(id), Number(status), callback);
        },
        createPromiseAttachment: function(id, attachment, callback) {
            _createPromiseAttachment(Number(id), attachment, callback);
        },
        getPromiseById: function(id, callback) {
            return _getPromiseById(Number(id), callback);
        },
        getPromisesByUsername: function(username, callback) {
            return _getPromisesByUsername(username, callback);
        }
    };

});
