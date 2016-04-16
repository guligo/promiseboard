define(['https', 'querystring', '../www/js/constantz'], function(https, querystring, constants) {

    var _getAccessToken = function(code, callback) {
        var data = querystring.stringify({
            'client_id': 'secret',
            'client_secret': 'secret',
            'grant_type': 'authorization_code',
            'redirect_uri' : constants.INSTAGRAM_REDIRECT_URL,
            'code' : code
        });

        var options = {
            host: 'api.instagram.com',
            port: 443,
            path: '/oauth/access_token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        try {
            var req = https.request(options, function(res) {
                var content = '';
                res.on('data', function(chunk) {
                    content += chunk;
                });
                res.on('end', function() {
                    if (callback) {
                        callback(JSON.parse(content));
                    }
                });
            });
            req.on('error', function(err) {
                console.error(err);
            });
            req.write(data);
            req.end();
        } catch (e) {
            console.error(e);
        }
    }

    var _getRecentMedia = function(accessToken, callback) {
        var options = {
            host: 'api.instagram.com',
            port: 443,
            path: '/v1/users/self/media/recent/?access_token=' + accessToken,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            var req = https.request(options, function(res) {
                var content = '';
                res.on('data', function(chunk) {
                    content += chunk;
                });
                res.on('end', function() {
                    if (callback) {
                        callback(JSON.parse(content));
                    }
                });
            });
            req.on('error', function(err) {
                console.error(err);
            });
            req.end();
        } catch (e) {
            console.error(e);
        }
    }

    return {
        getAccessToken: function(code, callback) {
            _getAccessToken(code, callback);
        },
        getRecentMedia: function(accessToken, callback) {
            _getRecentMedia(accessToken, callback);
        }
    }

});
