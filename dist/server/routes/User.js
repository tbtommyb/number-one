'use strict';

var userDB = require('../data/userDB.js');

var User = function (attr) {
    this.name = attr.name;
    this.password = attr.password;
    this.admin = attr.admin;
};

User.prototype.isInDB = function (callback) {
    userDB.checkExists(this.name, function (err, exists) {
        if (err) {
            console.error(err);
        }
        callback(exists);
    });
};

module.exports = User;