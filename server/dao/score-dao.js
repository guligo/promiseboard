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

    var _getScore = function(dto, callback) {
        console.log('Retrieving score for promise with id = [%s]', dto.promiseId);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingScore = {score: 0};
            client
                .query('SELECT SUM(score) \
                    FROM scores \
                    WHERE promise_id = $1 \
                    GROUP BY promise_id;',
                    [dto.promiseId])
                .on('row', function(row) {
                    resultingScore = {score: row.sum >= 0 ? row.sum : 0};
                })
                .on('end', function(result) {
                    if (callback) {
                        callback(resultingScore);
                    }
                    client.end();
                });
        });
    };

    var _getScoreByPromiseStatus = function(dto, callback) {
        console.log('Retrieving overall score for promises with status = [%s]', dto.status);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingScore = {score: 0};
            client
                .query('SELECT SUM(score) \
                    FROM scores \
                    WHERE promise_id in ( \
                        SELECT id \
                        FROM promises \
                        WHERE status = $1 \
                    ) \
                    GROUP BY promise_id;',
                    [dto.status])
                .on('row', function(row) {
                    resultingScore.score += Number(row.sum);
                })
                .on('end', function(result) {
                    if (callback) {
                        callback({score: resultingScore.score});
                    }
                    client.end();
                });
        });
    };

    var _getLatestScoreDateByUser = function(dto, callback) {
        // select creation_date from scores
        // where promise_id in (select id from promises where username = $1)
        // order by creation_date desc limit 1;
    };

    return {
        init: function(callback) {
            _init(callback);
        },
        createScore: function(dto, callback) {
            _createScore(dto, callback);
        },
        getScore: function(dto, callback) {
            _getScore(dto, callback);
        },
        getScoreByPromiseStatus: function(dto, callback) {
            _getScoreByPromiseStatus(dto, callback);
        }
    };

});
