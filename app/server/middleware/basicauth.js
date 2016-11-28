'use strict';

var basicAuth = require('basic-auth'),
    userDB = require('../data/userDB.js'),
    User = require('../routes/User.js');

module.exports = function (req, res, next) {
    var authHeaders = basicAuth(req);

    if (authHeaders === undefined || authHeaders.name === '' || authHeaders.pass === '') {
        res.status(401);
        res.setHeader('www-authenticate', 'Basic realm="number-one"');
        res.send({
            success: false,
            message: 'Please provide a username and password in the header.'
        });
    } else {
        req.user = new User({
            name: authHeaders.name,
            password: authHeaders.pass,
            admin: authHeaders.name === 'admin' ? 'true' : 'false'
        });
        userDB.checkExists(req.user.name, function (err, exists) {
            if (err) {
                return next(err);
            }
            req.user.existsInDB = exists ? true : false;
            next();
        });
    }
};