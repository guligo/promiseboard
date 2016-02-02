define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing [%s] DAO, database connection URL = [%s]', 'score', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    scores (\
                        promise_id INTEGER NOT NULL REFERENCES promises (id), \
                        creation_date TIMESTAMP NOT NULL, \
                        score INTEGER NOT NULL \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [%s] table completed!', 'scores');

                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    var _createScore = function(dto, callback) {
        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    scores (promise_id, creation_date, score) \
                    VALUES($1, $2, $3);',
                    [dto.promiseId, new Date(), dto.score])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    return {
        init: function(callback) {
            _init(callback);
        },
        createScore: function(dto, callback) {
            _createScore(dto, callback);
        }
    };

});
