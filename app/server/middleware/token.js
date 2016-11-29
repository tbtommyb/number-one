'use strict';

var jwt = require('jwt-simple');
var secret = require('../config.js')();

module.exports = function (req, res, next) {
    var token = req.query.token || req.headers['x-access-token'];
    if(!token) {
        return res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    }
    try {
        req.decoded = jwt.decode(token, secret);
    } catch (err) {
        return res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    }
    next();
};
