'use strict';

module.exports = function (req, res, next) {
    
    if (req.userObj.password === '') {
        res.status(400).send({
            success: false,
            message: 'Please provide a password in the header.'
        });
    } else {
        next();
    }
};