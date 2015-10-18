/* jslint node: true, nomen: true */

var express = require('express');
var tokenChecker = require('../middleware/token.js');
var adminChecker = require('../middleware/admin.js');


module.exports = (function() {
	'use strict';

	var user = require('./users.js');
	var config = require('../config.js');
	var record = require('./records.js');
	var auth = require('./auth.js');

	var apiRouter = express.Router();

	apiRouter.get('/register', user.addOne);
	apiRouter.get('/login', auth.login);

	// Authenticated users only

	apiRouter.use('*', tokenChecker);

	apiRouter.get('/records', record.getAll);
	apiRouter.get('/records/:reqDate/', record.getOne);

	// Authenticated and authorised users only

	apiRouter.use('*', adminChecker);

	apiRouter.get('/admin/users', user.getAll);

	apiRouter.put('/admin/user/:rowid', user.update);
	apiRouter.delete('/admin/user/:rowid', user.delete);

	apiRouter.post('/admin/records', record.create);
	apiRouter.put('/admin/records/:rowid', record.update);
	apiRouter.delete('/admin/records/:rowid', record.delete);

	return apiRouter;
})();