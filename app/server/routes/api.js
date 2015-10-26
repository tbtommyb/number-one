/* jslint node: true, nomen: true */

var express = require('express');

module.exports = (function () {
    'use strict';

    var users = require('./users.js'),
        record = require('./records.js'),
        authorise = require('./auth.js'),
        tokenChecker = require('../middleware/token.js'),
        adminChecker = require('../middleware/admin.js'),
        basicAuth = require('../middleware/basicauth.js'),
        requirePassword = require('../middleware/checkPassword.js'),
        encryptPassword = require('../middleware/encryptPassword.js'),
        valiDate = require('../middleware/validateDate.js');

    var apiRouter = express.Router();

    apiRouter.get('/', function(req, res, next) {
        res.status(200).send({message: 'hello!'});
    });

    apiRouter.use('*', basicAuth); // require username and password

    apiRouter.post('/register', requirePassword, encryptPassword, users.add);
    apiRouter.post('/login', requirePassword, authorise.user);

    // Authenticated users only

    apiRouter.use('*', tokenChecker); // require auth token

    apiRouter.get('/records', record.getAll);
    apiRouter.get('/records/:date/', valiDate, record.get);

    // Authenticated and authorised users only

    apiRouter.use('*', adminChecker); // require admin status

    apiRouter.get('/admin/users', users.getAll);
    apiRouter.get('/admin/users/:name', users.getOne);

    apiRouter.put('/admin/users/:name', encryptPassword, users.update);
    apiRouter.delete('/admin/users/:name', users.delete);

    apiRouter.post('/admin/records/:date', valiDate, record.create);
    apiRouter.put('/admin/records/:rowid', record.update);
    apiRouter.delete('/admin/records/:date', valiDate, record.delete);

    return apiRouter;
}());