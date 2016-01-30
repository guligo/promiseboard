define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing [%s] DAO, database connection URL = [%s]', 'user', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    users ( \
                        username VARCHAR(30) PRIMARY KEY, \
                        password VARCHAR(32) NOT NULL \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [users] table completed!');

                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    var _createUser = function(dto, callback) {
        console.log('Creating user with username = [%s] and password = [%s]', dto.username, dto.password);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    users (username, password) \
                    VALUES($1, $2);',
                    [dto.username, dto.password])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    };

    var _getUserByUsername = function(dto, callback) {
        console.log('Getting user by username = [%s]', dto.username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('SELECT * \
                    FROM users \
                    WHERE username = $1 LIMIT 1;',
                    [dto.username])
                .on('row', function(row) {
                    callback(row);
                })
                .on('end', function(result) {
                    if (result.rowCount === 0) {
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
        createUser: function (dto, callback) {
            _createUser(dto, callback);
        },
        getUserByUsername: function (dto, callback) {
            _getUserByUsername(dto, callback);
        }
    };

});
