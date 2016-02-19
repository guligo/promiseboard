define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing [%s] DAO, database connection URL = [%s]', 'notifications', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    notifications ( \
                        id SERIAL PRIMARY KEY \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [%s] table completed!', 'notifications');

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
        }
    };

});
