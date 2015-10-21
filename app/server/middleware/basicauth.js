'use strict';

var basicAuth = require('basic-auth'),
	userDB = require('../../data/userDB');

module.exports = function(req, res, next) {
	var user = basicAuth(req);

    if (user.name === '') {
	    res.status(400).send({
	        success: false,
	        message: 'Please provide a username in the header.'
	    });
    } else {
		req.userObj = {
			name: user.name,
			password: user.pass,
			admin: user.name === 'admin' ? true : false // this logic needs to go in 'user.get'
		};
		userDB.checkExists(req.userObj, function(err, exists) {
			if (err) {
				return next(err);
			}
			req.userObj.exists = exists ? true : false;
			/*if (response) {
				req.userObj.exists = true;
			} else {
				req.userObj.exists = false;
			}*/
			next();
		});
    }
};