'use strict';

var jwt = require('jwt-simple');
var user = require('../../data/users');
var secret = require('../config.js')();

module.exports = function(req, res, next) {

    var token = req.body.token || req.query.token || req.header['X-Access-Token'];
    var name = req.body.name || req.query.name;

    if (token) {
        try {
        	req.decoded = jwt.decode(token, secret);
        } catch (e) {
        	res.status(401).send({
        		success: false,
        		message: 'You entered an invalid token'
        	});
        }

        user.get(name, req, function (err, foundUser) {
        	if (err) {
        		throw err;
        	}
        	if (foundUser) {
	        	if (foundUser.name === req.decoded) {
	        		// user exists and correct token
	        		next();
	        	}
	        	else {
	        		console.log('Im here');
	        		res.status(401).send({
	        			success: false,
	        			message: 'Token does not match user'
	        		});
	        	}
        	} else {
        		res.status(401).send({
        			success: false,
        			message: 'User does not exist'
        		});
        	}
        });
    } else {
        res.status(401).send({
            succes: false,
            message: 'Please provide a valid token'
        });
    }
};