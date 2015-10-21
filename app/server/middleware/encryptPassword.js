'use strict';

var Bcrypt = require('../../data/bcrypt');

module.exports = function (req, res, next) {

	Bcrypt.encrypt(req.userObj, function (err, response) {
        if (err) {
            return next(err);
        }
        if (response) {
            next();
        }
    });
};