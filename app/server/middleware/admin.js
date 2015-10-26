'use strict';

module.exports = function (req, res, next) {

    if (req.decoded.admin !== 'true') {
        res.status(403).send({
            success: false,
            message: 'You are not authorised to access this endpoint'
        });
    } else {
        next();
    }
};