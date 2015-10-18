'use strict';

var jwt = require('jwt-simple');
var Bcrypt = require('../../data/bcrypt');
var userDB = require('../../data/userDB.js');
var secret = require('../config.js')();
var basicAuth = require('basic-auth');

var auth = {

    login: function (req, res) {
        var candidateUser = basicAuth(req);

        if (candidateUser.name === '' || candidateUser.pass === '') {
            res.status(400).send({
                success: false,
                message: 'Please provide name and password.'
            });
        }

        userDB.get(candidateUser.name, req, function (err, foundUser) {
            if (err) {
                throw err;
            }
            if (foundUser) {
                auth.checkPassword(candidateUser, foundUser, function (err, token) {
                    if (err) {
                        throw err;
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

    checkPassword: function (candidateUser, foundUser, callback) {
        Bcrypt.comparePassword(candidateUser.pass, foundUser.password, function (err, isMatch) {
            if (err) {
                return callback(err);
            }
            if (!isMatch) {
                return callback(null, isMatch);
            }
            if (isMatch) {
                return callback(null, jwt.encode(candidateUser.name, secret));
            }
        });
    }
};

module.exports = auth;
