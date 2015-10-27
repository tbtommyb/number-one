'use strict';

var jwt = require('jwt-simple');

module.exports = function (req, res, next) {

    var secret = process.env['SECRET'];

    var token = req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    } else {
        try {
            req.decoded = jwt.decode(token, secret);
        } catch (err) {
            return next(err);
        }
        next();
        /* maybe move the following logic into admin if needed
        if (req.user.name === req.decoded.name) {
            // user exists and correct token
            next();
        } else {
            res.status(403).send({
                success: false,
                message: 'Token does not match username'
            });
        }*/
    }
};