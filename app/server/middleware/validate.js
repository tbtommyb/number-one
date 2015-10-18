'use strict';

var jwt = require('jwt-simple');
var user = require('../../data/users');
var secret = require('../config.js')();

module.exports = function(req, res, next) {

    var token = req.body.token || req.query.token || req.header['X-Access-Token'];
    var name = req.body.name || req.query.name;

    if (token) {
        decoded = jwt.decode(token, secret);
        console.log('hello');

        // User is authenticated, check authorisation
        user.get(name, req, function (err, foundUser) {
        	if (err) {
        		throw err;
        	}
        	if (foundUser) {
        		if ((req.url.indexOf('admin') >= 0) && (foundUser.admin === 'true')) {
        			// user is authorised
        			next();
        		} else {
        			res.status(403).send({
        				success: false,
        				message: 'User not authorised.'
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
        return res.status(401).send({
            succes: false,
            message: 'Please provide a valid token'
        });
    }
};