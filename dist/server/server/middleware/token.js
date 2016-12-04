'use strict';

const path = require('path');
const jwt = require('jwt-simple');
const secret = process.env.SECRET || require(path.join('..', 'config'))();

module.exports = function(req, res, next) {
    const token = req.query.token || req.headers['x-access-token'];
    if(!token) {
        return res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    }
    try {
        req.decoded = jwt.decode(token, secret);
    } catch(err) {
        return res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    }
    next();
};
