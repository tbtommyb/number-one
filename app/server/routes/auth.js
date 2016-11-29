'use strict';

var jwt = require('jwt-simple');
var bcrypt = require('../data/bcrypt');
var users = require('../data/users.js');
var secret = require('../config.js')();

// add in user.get method

module.exports = (req, res, next) => {
    users.get(req.user.name, (err, storedUser) => {
        if(err) return next(err);
        if(!storedUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        bcrypt.comparePassword(req.user, storedUser.password, function(err, isMatch) {
            if(err) { return next(err); }
            if(!isMatch) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password'
                });
            }
            var payload = {
                iss: 'number-one-app',
                name: req.user.name,
                admin: storedUser.admin
            };
            res.status(200).send({
                success: true,
                message: 'Login successful',
                token: jwt.encode(payload, secret)
            });
        });
    });
};
