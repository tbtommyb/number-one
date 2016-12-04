'use strict';

const path = require('path');
const db = require(path.join(__dirname, 'db'));

const get = cb => {
    db.all('SELECT rowid, * FROM Users', function(err, rows) {
        if(err) { return cb(err); }
        cb(null, rows);
    });
};
console.log('test')

const getByName = (name, cb) => {
    db.all('SELECT rowid, * FROM Users WHERE name = ?', name, function(err, row) {
        if(err) { return cb(err); }
        cb(null, row);
    });
};

const create = (values, cb) => {
    db.run('INSERT OR IGNORE INTO Users (password, admin, name) VALUES (?, ?, ?)', values, function(err) {
        if(err) { return cb(err); }
        cb(null, this.lastID);
    });
};

const update = (data, cb) => {
    db.run('UPDATE Users SET password = ?, admin = ? WHERE name = ?', data, function(err) {
        if(err) { return cb(err); }
        cb(null, this.changes);
    });
};

const remove = (name, cb) => {
    db.run('DELETE FROM Users WHERE name = ?', name, function(err) {
        if(err) { return cb(err); }
        cb(null, this.changes);
    });
};

module.exports = {
    get: get,
    getByName: getByName,
    create: create,
    update: update,
    delete: remove
};