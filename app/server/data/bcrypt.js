'use strict';

const bcrypt = require('bcrypt');

const encrypt = function(value, callback) {
    bcrypt.genSalt(function(err, salt) {
        if (err) { return callback(err); }
        bcrypt.hash(value, salt, function(err, hash) {
            if (err) { return callback(err); }
            callback(null, hash);
        });
    });
};

const comparePassword = function(candidateUser, storedPassword, callback) {
    bcrypt.compare(candidateUser.password, storedPassword, function(err, isMatch) {
        if (err) { return callback(err); }
        callback(null, isMatch);
    });
};

module.exports = {
    encrypt: encrypt,
    comparePassword: comparePassword
};