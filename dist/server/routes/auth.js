'use strict';

const path = require('path');
const jwt = require('jwt-simple');
const bcrypt = require(path.join('..', 'data', 'bcrypt'));
const users = require(path.join('..', 'data', 'users.js'));
const secret = process.env.SECRET || require(path.join('..', 'config.js'))();

module.exports = (req, res, next) => {
    users.getByName(req.user.name, (err, rows) => {
        if(err) return next(err);
        if(!rows.length) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        const storedUser = rows[0];
        bcrypt.comparePassword(req.user, storedUser.password, function(err, isMatch) {
            if(err) { return next(err); }
            if(!isMatch) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password'
                });
            }
            const payload = {
                iss: 'number-one-app',
                name: req.user.name,
                admin: storedUser.admin
            };
            res.status(200).send({
                success: true,
                message: 'Login successful',
                token: jwt.encode(payload, secret)
            });
        });
    });
};
