'use strict';

var jwt = require('jwt-simple');
var bcrypt = require('../../data/bcrypt');
var userDB = require('../../data/userDB.js');
var secret = process.env.SECRET;

// add in user.get method

var authorise = {

    user: function (req, res, next) {
        if (req.user.existsInDB) {
            userDB.get(req.user.name, function (err, userReturned) {
                if (err) {
                    return next(err);
                }
                bcrypt.comparePassword(req.user, userReturned.password, function (err, isMatch) {
                    if (err) {
                        return next(err);
                    }
                    if (!isMatch) {
                        res.status(401).send({
                            success: false,
                            message: 'Incorrect password'
                        });
                    } else if (isMatch) {
                        var payload = {
                            iss: 'number-one-app',
                            name: req.user.name,
                            admin: userReturned.admin
                        };
                        res.status(200).send({
                            success: true,
                            message: 'Login successful',
                            token: jwt.encode(payload, secret)
                        });
                    }
                });
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'User not found in database'
            });
        }
    }
};

module.exports = authorise;
