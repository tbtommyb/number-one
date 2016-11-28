'use strict';

var userDB = require('../data/userDB');
var db = require('../data/db');
var User = require('./User.js');

var handleResult = function(req, res, next) {
    return function(err, response) {
        if(err) { return next(err); }
        if(response) { return res.status(200).json(response); }
        res.status(404).send({
            success: false,
            message: 'Resource not found'
        });
    };
};

var users = {
    get: function(req, res, next) {
        db.get('SELECT rowid, * FROM Users WHERE name = ?', req.user.name,
                handleResult(req, res, next));
    },
    getOne: function(req, res, next) {
        db.get('SELECT rowid, * FROM Users WHERE name = ?', req.params.name,
                handleResult(req, res, next));
    }
    getAll: function (req, res, next) {
        db.all('SELECT rowid, * FROM Users', handleResult(req, res, next));
    },
    add: function (req, res, next) {
        var values = [req.user.name, req.user.password, req.user.admin];
        db.run('INSERT OR IGNORE INTO Users VALUES (?, ?, ?)', values, function(err) {
            if(err) { return next(err); }
            res.status(201).send({success: true, message: 'User created'});
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