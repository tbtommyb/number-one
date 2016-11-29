'use strict';

const basicAuth = require('basic-auth');
const users = require('../data/users.js');

module.exports = function(req, res, next) {
    var authHeaders = basicAuth(req);

    if (authHeaders === undefined || authHeaders.name === '' || authHeaders.pass === '') {
        res.status(401);
        res.setHeader('www-authenticate', 'Basic realm="number-one"');
        return res.send({
            success: false,
            message: 'Please provide a username and password in the header.'
        });
    }
    req.user = {
        name: authHeaders.name,
        password: authHeaders.pass,
        admin: authHeaders.name === 'admin' ? 'true' : 'false'
    };
    next();
};