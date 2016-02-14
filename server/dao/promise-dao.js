define(['pg', '../www/js/constantz'], function(pg, constants) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing [%s] DAO, database connection URL = [%s]', 'promise', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    promises (\
                        id SERIAL PRIMARY KEY, \
                        username VARCHAR(30) NOT NULL REFERENCES users (username), \
                        description TEXT NOT NULL, \
                        tag TEXT, \
                        creation_date TIMESTAMP NOT NULL, \
                        due_date TIMESTAMP NOT NULL, \
                        status_change_date TIMESTAMP, \
                        status INTEGER NOT NULL \
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

    var _rowToPromise = function(row) {
        var promise = row;

        promise.creationDate = new Date(promise.creation_date);
        promise.dueDate = new Date(promise.due_date);
        promise.statusChangeDate = new Date(promise.status_change_date);

        delete promise.creation_date;
        delete promise.due_date;
        delete promise.status_change_date;
        return promise;
    }

    var _createPromise = function(username, description, tag, dueDate, callback) {
        console.log('Creating promise for username = [%s] with description = [%s], tag = [%s], dueData = [%s]', username, description, tag, dueDate);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingId;
            client
                .query('INSERT INTO \
                    promises (username, description, tag, creation_date, due_date, status, status_change_date) \
                    VALUES ($1, $2, $3, $4, $5, $6, $4) \
                    RETURNING id;',
                    [username, description, tag, new Date(), dueDate, constants.PROMISE_COMMITED], function(err, res) {
                        resultingId = res.rows[0].id;
                    })
                .on('end', function(result) {
                    if (callback) {
                        callback(resultingId);
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
                    SET status = $2, status_change_date = $3 \
                    WHERE id = $1;',
                    [id, status, new Date()])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    var _updatePromiseStatuses = function(promises, callback) {
        if (promises && promises.length > 0) {
            __updatePromiseStatuses(promises, 0, function() {
                if (callback) {
                    callback();
                }
            });
        } else {
            if (callback) {
                callback();
            }
        }
    }

    var __updatePromiseStatuses = function(promises, index, callback) {
        var promise = promises[index];
        _updatePromiseStatus(promise.id, promise.status, function() {
            if (index < promises.length - 1) {
                __updatePromiseStatuses(promises, index + 1, callback);
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    }

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
                    resultingPromise = _rowToPromise(row);
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
                    WHERE username = $1 \
                    AND status != $2 \
                    ORDER BY status_change_date ASC;',
                    [username, constants.PROMISE_DELETED])
                .on('row', function(row) {
                    resultingPromises.push(_rowToPromise(row));
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
        createPromise: function(username, description, tag, dueDate, callback) {
            _createPromise(username, description, tag, new Date(dueDate), callback);
        },
        updatePromiseStatus: function(id, status, callback) {
            _updatePromiseStatus(Number(id), Number(status), callback);
        },
        updatePromiseStatuses: function(promises, callback) {
            _updatePromiseStatuses(promises, callback);
        },
        getPromiseById: function(id, callback) {
            return _getPromiseById(Number(id), callback);
        },
        getPromisesByUsername: function(username, callback) {
            return _getPromisesByUsername(username, callback);
        }
    };

});
