var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

// data stores

var _users = [
    {
        username: 'guligo',
        password: 'qwerty'
    }
];

// helper functions

var getUserByUsername = function(username) {
    var result;
    _users.forEach(function(user) {
        if (user.username === username) {
            result = user;
        }
    });
    return result;
}

var clone = function(object) {
    return JSON.parse(JSON.stringify(object));
}

// RESTful services

app.get('/users', function(req, res) {
    var users = clone(_users);
    users.forEach(function(user) {
        user.password = '****';
    });

    res.end(JSON.stringify(users));
    res.sendStatus(200);
});

app.post('/users/login', function(req, res) {
    try {
        var submittedUser = req.body;
        var actualUser = getUserByUsername(submittedUser.username);

        if (actualUser === undefined) {
            throw 'User does not exist'
        }
        if (submittedUser.password !== actualUser.password) {
            throw 'Wrong password'
        }

        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

app.post('/users/register', function(req, res) {
    try {
        var submittedUser = req.body;

        if (submittedUser.username.length < 6) {
            throw 'Username too short';
        }
        if (submittedUser.password.length < 6) {
            throw 'Password too short'
        }
        if (submittedUser.password !== submittedUser.confirm) {
            throw 'Password and password confirmation do not match';
        }
        if (getUserByUsername(submittedUser.username) !== undefined) {
            throw 'User already exists';
        }

        _users.push({
            username: submittedUser.username,
            password: submittedUser.password
        });
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

// main

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
