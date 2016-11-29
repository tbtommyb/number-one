'use strict';

const express = require('express');
const path = require('path');
const allowMethods = require('allow-methods');
const records = require(__dirname + '/../data/records.js');
const users = require(__dirname + '/../data/users.js');
const authorise = require('./auth.js');
const util = require('./util');

const adminChecker = require('../middleware/admin.js');
const basicAuth = require('../middleware/basicauth.js');
const encryptPassword = require('../middleware/encryptPassword.js');
const validateDate = require('../middleware/validateDate.js');
const validateNewUser = require('../middleware/validateNewUser');

var apiRouter = express.Router();

apiRouter.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/../../public/api.html'));
});

apiRouter.route('/register')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, encryptPassword, validateNewUser, (req, res) => {
        users.add(req.newUser, util.handleInsert(req, res));
    });

apiRouter.route('/login')
   .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, authorise.user); /* TODO */

apiRouter.route('/records')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get((req, res) => {
        records.getAll(util.serveRows(req, res));
    });

apiRouter.route('/records/:date/')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(validateDate, (req, res) => {
        records.get(req.params.date, util.serveRows(req, res));
    });

// Authenticated and authorised users only

apiRouter.use('*', adminChecker); // require admin status

apiRouter.use('/admin/users', require('./admin/users'));
apiRouter.use('/admin/records', require('./admin/records'));
apiRouter.use(function(err, req, res) {
    res.status(err.status || 500).send({
        message: err.message
    });
});

module.exports = function() { return apiRouter; };
