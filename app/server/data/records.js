'use strict';

var db = require('./db');

var getAll = cb => {
    db.all('SELECT rowid, * FROM Data', function(err, rows) {
        if(err) { return cb(err); }
        return cb(null, rows);
    });
};

var get = (date, cb) => {
    db.get('SELECT rowid, * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1', date, function (err, row) {
        if(err) { return cb(err); }
        return cb(null, row);
    });
};

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

var remove = (date, cb) => {
    db.run('DELETE FROM Data WHERE date = ?', date, function(err) {
        if(err) { return cb(err); }
        return cb(null, this.changes);
    });
};

module.exports = {
    getAll: getAll,
    get: get,
    create: create,
    update: update,
    delete: remove
};

