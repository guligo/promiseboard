define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing user DAO, database connection URL = [%s]', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    instagram_profiles ( \
                        username VARCHAR(30) NOT NULL REFERENCES users (username) PRIMARY KEY, \
                        instagram_username TEXT NOT NULL, \
                        user_id TEXT NOT NULL, \
                        token TEXT NOT NULL \
                    );')
                .on('end', function(result) {
                    console.log('Creation of [user_instagram_profiles] table completed!');

                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _createInstagramProfile = function(username, instagramUsername, userId, token, callback) {
        console.log(
            'Creating instagram profile for username = [%s] with instagram username = [%s], user id = [%s] and token = [%s]',
            username, instagramUsername, userId, token
        );

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    instagram_profiles (username, instagram_username, user_id, token) \
                    VALUES ($1, $2, $3, $4);',
                    [username, instagramUsername, userId, token])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _getInstagramProfile = function(username, callback) {
        console.log('Getting instagram profile for user with username = [%s]', username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingProfile;
            client
                .query('SELECT * FROM instagram_profiles \
                    WHERE username = $1;',
                    [username])
                .on('row', function(row) {
                    resultingProfile = row;
                })
                .on('end', function(result) {
                    if (callback) {
                        callback(resultingProfile);
                    }
                    client.end();
                });
        });
    }

    var _deleteInstagramProfile = function(username, callback) {
        console.log('Removing instagram profile for user with username = [%s]', username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('DELETE FROM instagram_profiles \
                    WHERE username = $1;',
                    [username])
                .on('end', function(result) {
                    if (callback) {
                        callback();
                    }
                    client.end();
                });
        });
    }

    var _recreateInstagramProfile = function(username, authenticationResponse, callback) {
        _deleteInstagramProfile(username, function() {
            _createInstagramProfile(
                username,
                authenticationResponse.user.username,
                authenticationResponse.user.id,
                authenticationResponse.access_token,
                callback
            );
        });
    }

    return {
        init: function(callback) {
            _init(callback);
        },
        createInstagramProfile: function(username, instagramUsername, userId, token, callback) {
            _createInstagramProfile(username, instagramUsername, userId, token, callback);
        },
        getInstagramProfile: function(username, callback) {
            _getInstagramProfile(username, callback);
        },
        deleteInstagramProfile: function(username, callback) {
            _deleteInstagramProfile(username, callback);
        },
        recreateInstagramProfile: function(username, authenticationResponse, callback) {
            _recreateInstagramProfile(username, authenticationResponse, callback);
        }
    };

});
