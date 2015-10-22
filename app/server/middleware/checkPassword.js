'use strict';

module.exports = function (req, res, next) {

    if (req.user.password === '') {
        res.status(400).send({
            success: false,
            message: 'Please provide a password in the header.'
        });
    } else {
        next();
    }
};