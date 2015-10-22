'use strict';

var basicAuth = require('basic-auth'),
	userDB = require('../../data/userDB.js'),
	User = require('../routes/User.js');

module.exports = function(req, res, next) {
	var authHeaders = basicAuth(req);

    if (authHeaders.name === '') {
	    res.status(400).send({
	        success: false,
	        message: 'Please provide a username in the header.'
	    });
    } else {
		req.user = new User({
			name: authHeaders.name,
			password: authHeaders.pass,
			admin: authHeaders.name === 'admin' ? true : false // this logic needs to go in 'user.get'
		});
		userDB.checkExists(req.user.name, function (err, exists) {
			if (err) {
				return next(err);
			}
			req.user.existsInDB = exists ? true : false;
			next();
		});
    }
};