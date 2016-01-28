define(['fs', 'connect-multiparty', '../www/js/constantz', '../www/js/common-utils', '../dao/attachment-dao'],
    function(fs, multipart, constants, commonUtils, attachmentDao) {

    var _init = function(app, checkAuthAsync) {
        console.log('Initializing REST [%s] module...', 'attachment');

        var multipartMiddleware = multipart();
        app.post('/attachment/:promiseId', multipartMiddleware, function(req, res) {
            fs.readFile(req.files['file'].path, 'hex', function(err, data) {
                data = '\\x' + data;

                var dto = {
                    promiseId: req.params.promiseId,
                    data: data
                };

                attachmentDao.createAttachment(dto, function() {
                    res.sendStatus(200);
                });
            });
        });

        app.get('/attachment/:promiseId', function(req, res) {
            var dto = {
                promiseId: req.params.promiseId,
            };

            attachmentDao.hasAttachment(dto, function(result) {
                res.end(JSON.stringify(result));
            });
        });

        app.get('/attachment/:promiseId/data', function(req, res) {
            var dto = {
                promiseId: req.params.promiseId,
            };

            attachmentDao.getAttachment(dto, function(attachment) {
                res.end(attachment.data, 'binary');
            });
        });

        console.log('REST [%s] module initialized!', 'user');
    }

    return {
        init: function(app, checkAuthAsync) {
            _init(app, checkAuthAsync);
        }
    }

});
