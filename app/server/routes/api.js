'use strict';

var express = require('express'),
    path = require('path');
var users = require('./users.js'),
    record = require('./records.js'),
    authorise = require('./auth.js'),
    tokenChecker = require('../middleware/token.js'),
    adminChecker = require('../middleware/admin.js'),
    basicAuth = require('../middleware/basicauth.js'),
    allowMethods = require('allow-methods'),
    encryptPassword = require('../middleware/encryptPassword.js'),
    valiDate = require('../middleware/validateDate.js');
var apiRouter = express.Router();

apiRouter.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/../../public/api.html'));
});

apiRouter.route('/register')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, encryptPassword, users.add);

apiRouter.route('/login')
   .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, authorise.user);

apiRouter.route('/records')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(record.getAll);

apiRouter.route('/records/:date/')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(valiDate, record.get);

// Authenticated and authorised users only

apiRouter.use('*', adminChecker); // require admin status

apiRouter.route('/admin/users')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(users.getAll);

apiRouter.route('/admin/users/:name')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(users.getOne);

apiRouter.route('/admin/users/:name')
    .all(allowMethods(['put'], 'Please use PUT method'))
    .put(encryptPassword, users.update);

apiRouter.route('/admin/users/:name')
    .all(allowMethods(['delete'], 'Please use DELETE method'))
    .delete(users.delete);

apiRouter.route('/admin/records/:date')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(valiDate, record.create);

apiRouter.route('/admin/records/:rowid')
    .all(allowMethods(['put'], 'Please use PUT method'))
    .put(valiDate, record.update);

apiRouter.route('/admin/records/:date')
    .all(allowMethods(['delete'], 'Please use DELETE method'))
    .delete(valiDate, record.delete);

apiRouter.use(function (err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message
    });
});

module.exports = function() { return apiRouter; };
