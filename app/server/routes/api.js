/* jslint node: true, nomen: true */

// what is someone uses incorrect verb? need an error for that

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
        encryptPassword = require('../middleware/encryptPassword.js');

    var apiRouter = express.Router();

    apiRouter.use('*', basicAuth); // require username and password

    apiRouter.post('/register', requirePassword, encryptPassword, users.add);
    apiRouter.post('/login', requirePassword, authorise.user);

    // Authenticated users only

    apiRouter.use('*', tokenChecker); // require auth token

    apiRouter.get('/records', record.getAll);
    apiRouter.get('/records/:reqDate/', record.getOne);

    // Authenticated and authorised users only

    apiRouter.use('*', adminChecker); // require admin status

    apiRouter.get('/admin/users', users.getAll);
    apiRouter.get('/admin/users/:name', users.getOne);

    apiRouter.put('/admin/users/:name', encryptPassword, users.update);
    apiRouter.delete('/admin/users/:name', users.delete);

    apiRouter.post('/admin/records', record.create);
    apiRouter.put('/admin/records/:rowid', record.update);
    apiRouter.delete('/admin/records/:rowid', record.delete);

    return apiRouter;
}());