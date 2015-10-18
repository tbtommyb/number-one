'use strict';

var Bcrypt = require('../../data/bcrypt');
var user = require('../../data/users');

var users = {

	addOne: function (req, res) {
	    if (req.query.name && req.query.password) {
	        var newUser = new user.Create({
	            name: req.query.name,
	            password: req.query.password,
	            admin: req.query.admin
	        });
	        // check that user doesn't exist first
	        user.get(newUser.name, req, function (err, userExists) {
	            if (err) {
	                throw err;
	            }
	            if (userExists) {
	                res.send('The user already exists!');
	            } else {
	                Bcrypt.encrypt(newUser, function (err, response) {
	                    if (err) {
	                        throw err;
	                    }
	                    if (response) {
	                        user.add(newUser, req, function (err, isAdded) {
	                            if (err) {
	                                throw err;
	                            }
	                            if (isAdded) {
	                                res.status(201).send({success: true, message: 'User created'});
	                            }
	                        });  
	                    }
	                });
	            }
	        });
	    } else {
	        res.status(400).send({
	            success: false,
	            message: 'Please provide name and password.'
	        });
	    }
	},

	getAll: function (req, res) {
	    user.getAll(req, function (err, rows) {
	        if (err) {
	            throw err;
	        }
	        res.status(200).json(rows);
	    });
	},

	update: function (req, res) {
	    if (!req.body.rowid) {
	        res.status(400).send({
	            success: false,
	            message: 'User updates need the row ID'
	        });
	    }
	    var updatedInfo = new userCreate({
	    	name: req.body.name,
	    	password: req.body.password,
	    	admin: req.body.admin,
	    	rowid: req.params.rowid
	    });
		user.get(updatedInfo.name, function (err, row) {
			if (err) {
				throw err;
			}
			if (row) {
	            user.update(updatedInfo, req, function (err, done) {
	            	if (err) {
	            		throw err;
	            	}
	            	if (done) {
	            		res.status(200).send({
	            			success: true,
	            			message: 'User details successfully updated'
	            		});
	            	}
	            });
			} else {
				res.status(404).send({
					success: false,
					message: 'The user does not exist'
				});
			}
		});
	},

	delete: function (req, res) {
		var rowID = req.params.rowid;
		user.delete(rowID, req, function (err, done) {
			if (err) {
				throw err;
			}
			if (done) {
				res.status(200).send({message: 'A OK!'});
			}
		});
	}
}

module.exports = users;