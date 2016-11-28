'use strict';

var sqlite3 = require('sqlite3');
var path = require('path');

module.exports = new sqlite3.Database(path.join(__dirname, 'data.db'));
