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
    resave: true,
    saveUninitialized: true,
    secret: 'kuss',
    cookie: {
        maxAge: 30000
    }
}));

// data stores

var _users = [
    {
        username: 'guligo',
        password: 'qwerty'
    }
];

const PROMISES_COMMITED = 1;
const PROMISES_COMPLETED = 2;
const PROMISES_FAILED = 3;

var _promises = [
    {
        username: 'guligo',
        description: 'I promise to myself...'
    },
    {
        username: 'guligo',
        description: 'I promise to myself...'
    }
];

// helper functions

var clone = function(object) {
    return JSON.parse(JSON.stringify(object));
}

var createException = function(text) {
    return {checked: true, text: text};
}

// persistence layer functions

var createUser = function(username, password) {
    _users.push({
        username: username,
        password: password
    });
}

var getUsers = function() {
    var users = clone(_users);
    users.forEach(function(user) {
        user.password = '****';
    });
    return users;
}

var getUserByUsername = function(username) {
    var resultingUser;
    _users.forEach(function(user) {
        if (user.username === username) {
            resultingUser = user;
        }
    });
    return resultingUser;
}

var createPromise = function(username, description) {
    _promises.push({
        username: username,
        description: description
    });
}

var getPromisesByUsername = function(username) {
    var resultingPromises = [];
    _promises.forEach(function(promise) {
        if (promise.username === username) {
            resultingPromises.push(promise);
        }
    });
    return resultingPromises;
}

// RESTful services

app.get('/users', function(req, res) {
    var users = getUsers();
    res.end(JSON.stringify(users));
});

app.post('/users/login', function(req, res) {
    try {
        var submittedUser = req.body;
        var actualUser = getUserByUsername(submittedUser.username);

        if (actualUser === undefined) {
            throw createException('User does not exist');
        }
        if (submittedUser.password !== actualUser.password) {
            throw createException('Wrong password');
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
            throw createException('Username too short');
        }
        if (submittedUser.password.length < 6) {
            throw createException('Password too short');
        }
        if (submittedUser.password !== submittedUser.confirm) {
            throw createException('Password and password confirmation do not match');
        }
        if (getUserByUsername(submittedUser.username) !== undefined) {
            throw createException('User already exists');
        }

        createUser(submittedUser.username, submittedUser.password);
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

        if (submittedUser.description.length <= 0) {
            throw createException('Description empty');
        }

        createPromise(req.session.username, submittedPromise.description);
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
    var promises = getPromisesByUsername(req.session.username);
    res.end(JSON.stringify(promises));
});

// main

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
