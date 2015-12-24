var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("HTTP server listening at http://%s:%s", host, port);
});
