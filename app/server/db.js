'use strict';

var sqlite3 = require('sqlite3'),
	path = require('path');

var file = path.join(__dirname, 'data/data.db');

var db = new sqlite3.Database(file);

module.exports = function () {
	return db;
};