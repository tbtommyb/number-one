'use strict';

var jwt = require('jwt-simple');
var userDB = require('../../data/userDB.js');
var secret = require('../config.js')();

module.exports = function (req, res, next) {

    var token = req.query.token || req.headers['x-access-token'];

    if (token) {
        console.log(token);
        try {
            req.decoded = jwt.decode(token, secret);
        }
        catch (err) {
            return next(err);
        }         
        users.get(req.userObj.name, function (err, storedUser) {
            if (err) {
                return next(err);
            }
            if (storedUser) {
                if (storedUser.name === req.decoded) {
                    // user exists and correct token
                    next();
                } else {
                    res.status(401).send({
                        success: false,
                        message: 'Token does not match user'
                    });
                }
            } else {
                res.status(401).send({
                    success: false,
                    message: 'User does not exist'
                });
            }
        });

    } else {
        res.status(401).send({
            succes: false,
            message: 'Please provide a valid token'
        });
    }
};