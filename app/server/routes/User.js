'use strict';

var Bcrypt = require('../../data/bcrypt');
var userDB = require('../../data/userDB.js');

function User (attr) {
	this.name = attr.name;
	this.password = attr.password;
	this.admin = attr.admin;

	var callback = function (err, response) {
		if (err) {
			console.log('there is an error');
			return 'error';
		}
		if (response) {
			that.existsInDB = 'true';
			return true;
		} else {
			that.existsInDB = 'false';
			return false;
		}
	};
	var that = this;
	this.checkInDB(function (err, result) {
		that.exists = result;
		console.log(result);
	});
	console.log(this.exists);
};

User.prototype.checkInDB = function (callback) {
	var that = this;
	userDB.checkExists(that.name, function(err, exists) {
		if (err) {
			console.error(err);
		}
		if (exists) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	});
};

module.exports = User;