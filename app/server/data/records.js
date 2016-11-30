'use strict';

var db = require('./db');

var get = cb => {
    db.all('SELECT rowid, * FROM Data', function(err, rows) {
        if(err) { return cb(err); }
        return cb(null, rows);
    });
};

var getByDate = (date, cb) => {
    db.all('SELECT rowid, * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1', date, function (err, rows) {
        if(err) { return cb(err); }
        return cb(null, rows);
    });
};

/* Specify order of values - TODO */
var create = (data, cb) => {
    db.run('INSERT OR IGNORE INTO Data VALUES (?, ?, ?, ?)', data, function(err) {
        if(err) { return cb(err); }
        return cb(null, this.lastID);
    });
};

var update = (data, cb) => {
    db.run('UPDATE Data SET date = ?, artist = ?, title = ?, weeks = ? WHERE rowid = ?',
        data, function (err) {
            if(err) { return cb(err); }
            return cb(null, this.changes);
        });
};

var remove = (rowid, cb) => {
    db.run('DELETE FROM Data WHERE rowid = ?', rowid, function(err) {
        if(err) { return cb(err); }
        return cb(null, this.changes);
    });
};

module.exports = {
    getByDate: getByDate,
    get: get,
    create: create,
    update: update,
    delete: remove
};

