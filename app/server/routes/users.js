'use strict';

var userDB = require('../../data/userDB');
var User = require('./User.js');

var users = {

    get: function (req, res, next) {
        userDB.get(req.userObj.name, function (err, storedUser) {
            if (err) {
                return next(err);
            }
            if (storedUser) {
                console.log('in users.get');
                res.status(200).json(storedUser);
            } else {
                res.status(404).send({
                    success: false,
                    message: 'User not found'
                });
            }
        });
    },

    getOne: function (req, res, next) {
        userDB.get(req.params.name, function (err, storedUser) {
            if (err) {
                return next(err);
            }
            if (storedUser) {
                console.log('in users.get');
                res.status(200).json(storedUser);
            } else {
                res.status(404).send({
                    success: false,
                    message: 'User not found'
                });
            }
        });
    },

    add: function (req, res, next) {
        // check that user doesn't exist first
        if (req.user.exists) {
            res.send('The user already exists!');
        }
        else {
            userDB.add(req.user, function (err, isAdded) {
                if (err) {
                    return next(err);
                }
                if (isAdded) {
                    res.status(201).send({
                        success: true,
                        message: 'User created'
                    });
                }
            });
        }
    },

    getAll: function (req, res, next) {
        userDB.getAll(function (err, rows) {
            if (err) {
                return next(err);
            }
            res.status(200).json(rows);
        });
    },

    update: function (req, res, next) {
        // find a way to make these optional
        var update = new User({
            name: req.params.name,
            password: req.body.password,
            admin: req.body.admin,
        });
        if (!update.existsInDB) {
            res.status(404).send({
                success: false,
                message: 'The user does not exist'
            });            
        } else {
            userDB.update([update.password, update.admin, update.name], function (err, done) {
                if (err) {
                    return next(err);
                }
                if (done) {
                    res.status(200).send({
                        success: true,
                        message: 'User details successfully updated'
                    });
                }
            });            
        }
    },

    delete: function (req, res, next) {
        var username = req.params.username;
        userDB.delete(username, function (err, done) {
            if (err) {
                return next(err);
            }
            if (done) {
                res.status(200).send({
                    success: true,
                    message: 'User successfully deleted'
                });
            }
        });
    }
};

module.exports = users;