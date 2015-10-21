'use strict';

var Bcrypt = require('../../data/bcrypt');
var userDB = require('../../data/userDB.js');

function User (attr) {
	this.name = attr.name;
	this.password = attr.password;
	this.admin = attr.admin;
	this.rowid = attr.rowid;

	this.encryptPassword();
	this.checkExists();
};

User.prototype.encryptPassword = function () {
	console.log(this);
	Bcrypt.encrypt(this, function (err, encrypted) {
        if (err) {
            return next(err);
        }
        if (encrypted) {
        	this.password = encrypted.password;
        	return true;
        }
    });
};

User.prototype.checkExists = function () {
	userDB.checkExists(this, function(err, exists) {
		if (err) {
			return next(err);
		}
		if (exists) {
			this.exists = true;
			return true;
		} else {
			this.exists = false;
			return false;
		}
	});	
};

module.exports = User;