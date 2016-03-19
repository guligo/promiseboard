define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing [%s] DAO, database connection URL = [%s]', 'attachments', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    attachments ( \
                        id SERIAL PRIMARY KEY, \
                        promise_id INTEGER NOT NULL REFERENCES promises (id), \
                        data BYTEA NOT NULL \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [%s] table completed!', 'attachments');

                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _createAttachment = function(dto, callback) {
        console.log('Creating an attachment for promise with id = [%s]', dto.promiseId);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    attachments (promise_id, data) \
                    VALUES ($1, $2);',
                    [dto.promiseId, dto.data])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _getAttachment = function(dto, callback) {
        console.log('Retrieving an attachment for promise with id = [%s]', dto.promiseId);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingAttachment;
            client
                .query('SELECT * \
                    FROM attachments \
                    WHERE promise_id = $1 \
                    LIMIT 1;',
                    [dto.promiseId])
                .on('row', function(row) {
                    resultingAttachment = row;
                })
                .on('end', function() {
                    if (callback) {
                        callback(resultingAttachment);
                    }
                    client.end();
                });
        });
    }

    var _hasAttachment = function(dto, callback) {
        console.log('Checking whether there is an attachment for promise with id = [%s]', dto.promiseId);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingAttachment;
            client
                .query('SELECT promise_id \
                    FROM attachments \
                    WHERE promise_id = $1 \
                    LIMIT 1;',
                    [dto.promiseId])
                .on('row', function(row) {
                    resultingAttachment = row;
                })
                .on('end', function() {
                    if (callback) {
                        callback({
                            flag: resultingAttachment != undefined
                        });
                    }
                    client.end();
                });
        });
    }

    return {
        init: function(callback) {
            _init(callback);
        },
        createAttachment: function(dto, callback) {
            _createAttachment(dto, callback);
        },
        getAttachment: function(dto, callback) {
            _getAttachment(dto, callback);
        },
        hasAttachment: function(dto, callback) {
            _hasAttachment(dto, callback);
        }
    };

});
