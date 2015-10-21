'use strict';

var bcrypt = require('bcrypt');

exports.encrypt = function encrypt(user, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback(null, user);
        });
    });
};

exports.comparePassword = function comparePassword(candidateUser, storedPassword, cb) {
    bcrypt.compare(candidateUser.password, storedPassword, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

