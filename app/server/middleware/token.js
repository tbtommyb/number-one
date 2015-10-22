'use strict';

var jwt = require('jwt-simple');
var secret = require('../config.js')();

module.exports = function (req, res, next) {

    var token = req.query.token || req.headers['x-access-token'];

    if (!token) {
        console.log('in token module');
        res.status(401).send({
            succes: false,
            message: 'Please provide a valid token'
        });
    } else {
        try {
            req.decoded = jwt.decode(token, secret);
        }
        catch (err) {
            return next(err);
        }         
        if (req.user.name === req.decoded) {
            // user exists and correct token
            next();
        } else {
            res.status(401).send({
                success: false,
                message: 'Token does not match username'
            });
        }
    }
};