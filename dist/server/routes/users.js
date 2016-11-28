'use strict';

var userDB = require('../data/userDB');
var User = require('./User.js');

var users = {

    get: function (req, res, next) {
        userDB.get(req.user.name, function (err, storedUser) {
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

    getOne: function (req, res, next) {
        userDB.get(req.params.name, function (err, storedUser) {
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
        if (req.user.existsInDB) {
            res.status(409).send('The user already exists!');
        } else {
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
        if (req.body.name && req.body.password && req.body.admin) {
            var updated = new User({
                name: req.body.name,
                password: req.body.password,
                admin: req.body.admin,
            });
            userDB.checkExists(req.params.name, function (err, exists) {
                if (err) {
                    return next(err);
                }
                if (!exists) {
                    res.status(404).send({
                        success: false,
                        message: 'The user does not exist'
                    });
                } else {
                    userDB.update(updated, function (err, done) {
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
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Name, password and admin data not in correct format'
            });
        }
    },

    delete: function (req, res, next) {
        // add checks to this route
        userDB.get(req.params.name, function (err, exists) {
            if (err) {
                return next(err);
            }
            if (!exists) {
                res.status(404).send({
                    success: false,
                    message: 'The specified user does not exist'
                });
            } else {
                userDB.delete(req.params.name, function (err, done) {
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
        });
    }
};

module.exports = users;