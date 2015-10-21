/* jslint node: true, nomen: true */

var express = require('express');

module.exports = (function () {
    'use strict';

    var users = require('./users.js'),
        record = require('./records.js'),
        auth = require('./auth.js'),
        tokenChecker = require('../middleware/token.js'),
        adminChecker = require('../middleware/admin.js'),
        basicAuth = require('../middleware/basicauth.js'),
        checkPassword = require('../middleware/checkPassword.js'),
        encryptPassword = require('../middleware/encryptPassword.js');

    var apiRouter = express.Router();

    apiRouter.use('*', basicAuth); // require username and password

    apiRouter.post('/register', checkPassword, encryptPassword, users.add);
    apiRouter.post('/login', checkPassword, encryptPassword, auth.login);

    // Authenticated users only

    apiRouter.use('*', tokenChecker); // require auth token

    apiRouter.get('/records', record.getAll);
    apiRouter.get('/records/:reqDate/', record.getOne);

    // Authenticated and authorised users only

    apiRouter.use('*', adminChecker); // require admin status

    apiRouter.get('/admin/users', users.getAll);

    apiRouter.put('/admin/user/:rowid', encryptPassword, users.update);
    apiRouter.delete('/admin/user/:rowid', users.delete);

    apiRouter.post('/admin/records', record.create);
    apiRouter.put('/admin/records/:rowid', record.update);
    apiRouter.delete('/admin/records/:rowid', record.delete);

    return apiRouter;
}());