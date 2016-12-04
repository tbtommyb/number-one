'use strict';

const path = require('path');
const db = require(path.join(__dirname, 'db'));

const get = cb => {
    db.all('SELECT rowid, * FROM Data', function(err, rows) {
        if(err) { return cb(err); }
        return cb(null, rows);
    });
};

const getByDate = (date, cb) => {
    db.all('SELECT rowid, * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1', date, function (err, rows) {
        if(err) { return cb(err); }
        return cb(null, rows);
    });
};

const create = (input, cb) => {
    db.run('INSERT OR IGNORE INTO Data (date, artist, title, weeks) VALUES (?, ?, ?, ?)', input, function(err) {
        if(err) { return cb(err); }
        return cb(null, this.lastID);
    });
};

const update = (data, cb) => {
    db.run('UPDATE Data SET date = ?, artist = ?, title = ?, weeks = ? WHERE rowid = ?',
        data, function (err) {
            if(err) { return cb(err); }
            return cb(null, this.changes);
        });
};

const remove = (rowid, cb) => {
    db.run('DELETE FROM Data WHERE rowid = ?', rowid, function(err) {
        if(err) { return cb(err); }
        return cb(null, this.changes);
    });
};

module.exports = {
    get: get,
    getByDate: getByDate,
    create: create,
    update: update,
    delete: remove
};

