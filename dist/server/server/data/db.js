'use strict';

const sqlite3 = require('sqlite3');
const path = require('path');

module.exports = new sqlite3.Database(path.join(__dirname, 'data.db'));
