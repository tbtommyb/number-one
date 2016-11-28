'use strict';

var bcrypt = require('bcrypt');

var encrypt = function(variable, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(variable, salt, function (err, hash) {
            if (err) {
                return callback(err);
            }
            callback(null, hash);
        });
    });
};

var comparePassword = function(candidateUser, storedPassword, cb) {
    bcrypt.compare(candidateUser.password, storedPassword, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = {
    encrypt: encrypt,
    comparePassword: comparePassword
};