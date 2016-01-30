define(['pg'], function(pg) {

    const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/promiseboard';

    var _init = function(callback) {
        console.log('Initializing user DAO, database connection URL = [%s]', DATABASE_URL);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('CREATE TABLE IF NOT EXISTS \
                    user_instagram_profiles ( \
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

    var _createProfile = function(username, instagramUsername, userId, token, callback) {
        console.log(
            'Creating instagram profile for username = [%s] with instagram username = [%s], user id = [%s] and token = [%s]',
            username, instagramUsername, userId, token
        );

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('INSERT INTO \
                    user_instagram_profiles (username, instagram_username, user_id, token) \
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

    var _getProfile = function(username, callback) {
        console.log('Getting instagram profile for user with username = [%s]', username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            var resultingProfile;
            client
                .query('SELECT * FROM user_instagram_profiles \
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

    var _deleteProfile = function(username, callback) {
        console.log('Removing instagram profile for user with username = [%s]', username);

        pg.connect(DATABASE_URL, function(err, client) {
            if (err) throw err;

            client
                .query('DELETE FROM user_instagram_profiles \
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

    var _recreateProfile = function(username, authenticationResponse, callback) {
        _deleteProfile(username, function() {
            _createProfile(
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
        createProfile: function(username, instagramUsername, userId, token, callback) {
            _createProfile(username, instagramUsername, userId, token, callback);
        },
        getProfile: function(username, callback) {
            _getProfile(username, callback);
        },
        deleteProfile: function(username, callback) {
            _deleteProfile(username, callback);
        },
        recreateProfile: function(username, authenticationResponse, callback) {
            _recreateProfile(username, authenticationResponse, callback);
        }
    };

});
