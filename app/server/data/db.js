'use strict';

var sqlite3 = require('sqlite3');
var path = require('path');

var db = new sqlite3.Database(path.join(__dirname, 'data.db'));

module.exports = {
    db
};