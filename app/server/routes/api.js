'use strict';

const express = require('express');
const path = require('path');
const allowMethods = require('allow-methods');
const records = require(path.join(__dirname, '..', 'data', 'records'));
const users = require(path.join(__dirname, '..', 'data', 'users'));
const authorise = require(path.join(__dirname, 'auth'));
const util = require(path.join(__dirname, 'util'));

const admin = require(path.join('..', 'middleware', 'admin'));
const basicAuth = require(path.join('..', 'middleware', 'basicauth'));
const token = require(path.join('..', 'middleware', 'token'));
const encryptPassword = require(path.join('..', 'middleware', 'encryptPassword'));
const validateDate = require(path.join('..', 'middleware', 'validateDate'));

var apiRouter = express.Router();

// Open access routes
apiRouter.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'api.html'));
});

apiRouter.route('/register')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, encryptPassword, (req, res) => {
        var details = [req.user.password, req.user.admin, req.user.name];
        users.create(details, util.handleInsert(req, res));
    });

apiRouter.route('/login')
   .all(allowMethods(['post'], 'Please use POST method'))
    .post(basicAuth, authorise);

apiRouter.route('/records')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get((req, res) => {
        records.get(util.serveRows(req, res));
    });

apiRouter.route('/records/:date/')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(validateDate, (req, res) => {
        records.getByDate(req.params.date, util.serveRows(req, res));
    });

// Authenticated and authorised users only
apiRouter.use(token, admin);

apiRouter.use('/admin/users', require(path.join(__dirname, 'admin', 'users')));
apiRouter.use('/admin/records', require(path.join(__dirname, 'admin', 'records')));

apiRouter.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        err: err
    });
});

module.exports = function() { return apiRouter; };
