'use strict';

module.exports = function (req, res, next) {
    var regex = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/
    if (req.params.date.search(regex) !== -1) {
        next();
    } else {
        res.status(400).send({
            success: false,
            message: 'Invalid date string provided'
        });
    }
};