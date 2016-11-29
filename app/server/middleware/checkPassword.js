'use strict';

module.exports = function (req, res, next) {

    if (req.user.password === '') {
        return res.status(401).send({
            success: false,
            message: 'Please provide a password in the header.'
        });
    }
    next();
};