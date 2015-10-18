'use strict';

var Bcrypt = require('../../data/bcrypt');
var userDB = require('../../data/userDB');
var basicAuth = require('basic-auth');

var users = {

    addOne: function (req, res) {
        var newUser = basicAuth(req);
        if (newUser.name === '' || newUser.pass === '') {
            res.status(400).send({
                success: false,
                message: 'Please provide name and password.'
            });
        }
        newUser.admin = newUser.name === 'admin' ? true : false;
        // check that user doesn't exist first
        userDB.get(newUser.name, req, function (err, userExists) {
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
                        userDB.add(newUser, req, function (err, isAdded) {
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
    },

    getAll: function (req, res) {
        userDB.getAll(req, function (err, rows) {
            if (err) {
                throw err;
            }
            res.status(200).json(rows);
        });
    },

    update: function (req, res) {
        var updatedInfo = new userDB.Create({
            name: req.body.name,
            // this needs to be 'password' to work better with the Bcrypt function. Why doesn't pass work?
            password: req.body.password,
            admin: req.body.admin,
            rowid: req.params.rowid
        });
        userDB.get(updatedInfo.name, req, function (err, row) {
            if (err) {
                throw err;
            }
            if (row) {
                Bcrypt.encrypt(updatedInfo, function (err, response) {
                    if (err) {
                        throw err;
                    }
                    if (response) {
                        userDB.update(updatedInfo, req, function (err, done) {
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
        userDB.delete(rowID, req, function (err, done) {
            if (err) {
                throw err;
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