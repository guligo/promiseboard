var express = require('express');
var bodyParser = require('body-parser');
var session = require("express-session");
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'kuss',
    cookie: {
        maxAge: 30000
    }
}));

// custom application modules

var commonUtils = require('./common-utils');
var userDao = require("./dao/user-dao");
var promiseDao = require("./dao/promise-dao");

// helper functions

app.get('/users', function(req, res) {
    var users = userDao.getUsers();
    res.end(JSON.stringify(users));
});

app.post('/users/login', function(req, res) {
    try {
        var submittedUser = req.body;
        var actualUser = userDao.getUserByUsername(submittedUser.username);

        if (actualUser === undefined) {
            throw commonUtils.createException('User does not exist');
        }
        if (submittedUser.password !== actualUser.password) {
            throw commonUtils.createException('Wrong password');
        }

        req.session.username = actualUser.username;
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

app.post('/users/logout', function(req, res) {
    delete req.session.username;
    res.sendStatus(200);
});

app.post('/users/register', function(req, res) {
    try {
        var submittedUser = req.body;

        if (submittedUser.username.length < 6) {
            throw commonUtils.createException('Username too short');
        }
        if (submittedUser.password.length < 6) {
            throw commonUtils.createException('Password too short');
        }
        if (submittedUser.password !== submittedUser.confirm) {
            throw commonUtils.createException('Password and password confirmation do not match');
        }
        if (getUserByUsername(submittedUser.username) !== undefined) {
            throw commonUtils.createException('User already exists');
        }

        userDao.createUser(submittedUser.username, submittedUser.password);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        if (e.checked === true) {
            res.status(500).send(e.text);
        } else {
            res.sendStatus(500);
        }
    }
});

app.post('/promises', function(req, res) {
    try {
        var submittedPromise = req.body;

        if (submittedPromise.description.length <= 0) {
            throw commonUtils.createException('Description empty');
        }

        if (submittedPromise.id !== undefined) {
            promiseDao.updatePromise(Number(submittedPromise.id), submittedPromise.description, Number(submittedPromise.status));
        } else {
            promiseDao.createPromise(req.session.username, submittedPromise.description);
        }
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        if (e.checked === true) {
            res.status(500).send(e.text);
        } else {
            res.sendStatus(500);
        }
    }
});

app.get('/promises', function(req, res) {
    var promises = promiseDao.getPromisesByUsername(req.session.username);
    res.end(JSON.stringify(promises));
});

app.get('/promises/:id', function(req, res) {
    var promise = promiseDao.getPromiseById(Number(req.params.id));
    res.end(JSON.stringify(promise));
});

// main

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
