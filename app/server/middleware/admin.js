'use strict';

var user = require('../../data/users');

module.exports = function(req, res, next) {

    var name = req.body.name || req.query.name;

    user.get(name, req, function (err, foundUser) {
        if (err) {
            throw err;
        }
        if (foundUser) {
            if (foundUser.admin != 'true') {
                res.status(401).send({
                    success: false,
                    message: 'You are not authorised to access this endpoint'
                });
            } else {
                next();
            }
        }
    });
}