'use strict';

var users = require('../routes/users.js');

module.exports = function (req, res, next) {

    users.get(req.username, function (err, storedUser) {
        if (err) {
            return next(err);
        }
        if (storedUser) {
            if (storedUser.admin !== 'true') {
                res.status(401).send({
                    success: false,
                    message: 'You are not authorised to access this endpoint'
                });
            } else {
                next();
            }
        }
    });
};