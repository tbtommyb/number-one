'use strict';

var jwt = require('jwt-simple');
var Bcrypt = require('../../data/bcrypt');
var users = require('./users.js');
var secret = require('../config.js')();
var basicAuth = require('basic-auth');

// add in user.get method

var auth = {

    login: function (req, res, next) {
        users.get(req, res, function (err, storedUser) {
            if (err) {
                return next(err);
            }
            if (storedUser) {
                auth.checkPassword(req.userObj, storedUser.password, function (err, token) {
                    if (err) {
                        return next(err);
                    }
                    if (!token) {
                        res.status(401).send({
                            success: false,
                            message: 'Incorrect password'
                        });
                    } else if (token) {
                        res.status(200).send({
                            success: true,
                            message: 'Login successful',
                            token: token
                        });
                    }
                });
            } else {
                res.status(401).send({
                    success: false,
                    message: 'User not found'
                });
            }
        });
    },

    checkPassword: function (candidateUser, storedPassword, callback) {
        Bcrypt.comparePassword(candidateUser, storedPassword, function (err, isMatch) {
            if (err) {
                return callback(err);
            }
            if (!isMatch) {
                return callback(null, isMatch);
            }
            if (isMatch) {
                console.log(candidateUser.name);
                return callback(null, jwt.encode(candidateUser.name, secret));
            }
        });
    }
};

module.exports = auth;
