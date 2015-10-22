'use strict';

var userDB = require('../../data/userDB.js');

module.exports = function (req, res, next) {

    userDB.get(req.user.name, function (err, response) {
        if (err) {
            return next(err);
        }
        if (response.admin !== 'true') {
            res.status(401).send({
                success: false,
                message: 'You are not authorised to access this endpoint'
            });            
        } else {
            next();
        }
    });
};