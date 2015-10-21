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
        console.log(req.userObj);
        if (req.userObj.exists) {
            res.send('The user already exists!');
        }
        else {
            userDB.add(req.userObj, function (err, isAdded) {
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
        var userToUpdate = new User({
            name: req.body.name,
            password: req.body.password,
            admin: req.body.admin,
            rowid: req.params.rowid
        });
        if (!userToUpdate.exists) {
            res.status(404).send({
                success: false,
                message: 'The user does not exist'
            });            
        } else {
            userDB.update(userToUpdate, function (err, done) {
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
        var rowID = req.params.rowid;
        userDB.delete(rowID, function (err, done) {
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