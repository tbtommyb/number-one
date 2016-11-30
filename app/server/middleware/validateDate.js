'use strict';

module.exports = function (req, res, next) {
    var regex = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/
    console.log(req.params);
    console.log(req.body);
    if (req.params.date.search(regex) === -1) {
        return res.status(400).send({
            success: false,
            message: 'Invalid date string provided in URL'
        });
     }      
    // param date is valid, check for body date
    if (!req.body.date || req.body.date === '') {
        // no body date to check
        next();
    } else {
        if (req.body.date.search(regex) === -1) {
            return res.status(400).send({
                success: false,
                message: 'Invalid date string provided in body'
            });            
        }
        next();
    }
};