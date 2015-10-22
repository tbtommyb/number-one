'use strict';

var bcrypt = require('../../data/bcrypt');

module.exports = function (req, res, next) {

	// encrypt a password in the body if the request is to update a user
	if (req.body.password) {
		bcrypt.encrypt(req.body.password, function (err, response) {
			if (err) {
				return next(err);
			}
			if (response) {
				req.body.password = response;
			}
		});
	}
	bcrypt.encrypt(req.user.password, function (err, response) {
        if (err) {
            return next(err);
        }
        if (response) {
        	req.user.password = response;
            next();
        }
    });
};