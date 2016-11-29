'use strict';

var db = require('./db');

var get = (name, cb) => {
    db.get('SELECT rowid, * FROM Users WHERE name = ?', name, function(err, row) {
        if(err) { return cb(err); }
        cb(null, row);
    });
};

var getAll = cb => {
    db.all('SELECT rowid, * FROM Users', function(err, rows) {
        if(err) { return cb(err); }
        cb(null, rows);
    });
};

var add = (values, cb) => {
    db.run('INSERT OR IGNORE INTO Users (password, admin, name) VALUES (?, ?, ?)', values, function(err) {
        if(err) { return cb(err); }
        cb(null, this.lastID);
    });
};

var update = (data, cb) => {
    db.run('UPDATE Users SET password = ?, admin = ? WHERE name = ?', data, function(err) {
        if(err) { return cb(err); }
        cb(null, this.changes);
    });
};

var remove = (name, cb) => {
    db.run('DELETE FROM Users WHERE name = ?', name, function(err) {
        if(err) { return cb(err); }
        cb(null, this.changes);
    });
};

module.exports = {
    get: get,
    getAll: getAll,
    add: add,
    update: update,
    delete: remove
};