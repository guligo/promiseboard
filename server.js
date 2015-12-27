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

// data stores

var _users = [
    {
        username: 'guligo',
        password: 'qwerty'
    }
];

const PROMISE_COMMITED = 1;
const PROMISE_COMPLETED = 2;
const PROMISE_FAILED = 3;

var _promises = [
    {
        id: 1,
        username: 'guligo',
        description: 'I promise to myself...',
        status: PROMISE_COMMITED
    },
    {
        id: 2,
        username: 'guligo',
        description: 'I promise to myself...',
        status: PROMISE_COMMITED
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
    var id = getMaxPromiseId() + 1;
    _promises.push({
        id: id,
        username: username,
        description: description,
        status: PROMISE_COMMITED
    });
}

var updatePromise = function(id, description, status) {
    var promise = getPromiseById(id);
    promise.status = status;
};

var getPromiseById = function(id) {
    var resultingPromise;
    _promises.forEach(function(promise) {
        if (promise.id === id) {
            resultingPromise = promise;
        }
    });
    return resultingPromise;
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

var getMaxPromiseId = function() {
    var resultingId = 0;
    _promises.forEach(function(promise) {
        if (promise.id > resultingId) {
            resultingId = promise.id;
        }
    });
    return resultingId;
}

// RESTful services

/**
 * Example usage:
 *
 * app.get('/users', restrict function(req, res) ...
 */
function restrict(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        req.session.username = 'Access denied!';
        res.redirect('/index.html');
    }
}

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

        if (submittedPromise.description.length <= 0) {
            throw createException('Description empty');
        }

        if (submittedPromise.id !== undefined) {
            updatePromise(Number(submittedPromise.id), submittedPromise.description, submittedPromise.status);
        } else {
            createPromise(req.session.username, submittedPromise.description);
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
    var promises = getPromisesByUsername(req.session.username);
    res.end(JSON.stringify(promises));
});

app.get('/promises/:id', function(req, res) {
    var promise = getPromiseById(Number(req.params.id));
    res.end(JSON.stringify(promise));
});

// main

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
