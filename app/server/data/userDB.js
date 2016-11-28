'use strict';

var db = require('./db');

var checkExists = function(name, callback) {
    db.get('SELECT rowid, * FROM Users WHERE name = ?', name, function (err, exists) {
        if (err) {
            return callback(err);
        }
        if (exists) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
};

var get = function(name, callback) {
    db.get('SELECT rowid, * FROM Users WHERE name = ?', name, function (err, row) {
        if (err) {
            return callback(err);
        }
        if (!row) {
            callback(null, false);
        } else if (row) {
            callback(null, row);
        }
    });
};

var getAll = function(callback) {
    db.all('SELECT rowid, * FROM Users', function (err, rows) {
        if (err) {
            return callback(err);
        }
        if (!rows) {
            callback(null, false);
        } else if (rows) {
            callback(null, rows);
        }
    });
};

var add = function(input, callback) {
    var values = [input.name, input.password, input.admin];
    db.run('INSERT INTO Users VALUES (?, ?, ?)', values, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, true);
    });
};

var update = function(input, callback) {
    var values = [input.password, input.admin, input.name];
    db.run('UPDATE Users SET password = ?, admin = ? WHERE name = ?',
        values, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
};

var remove = function(name, callback) {
    db.run('DELETE FROM Users WHERE name = ?', name, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, true);
    });
};

module.exports = {
    checkExists: checkExists,
    get: get,
    getAll: getAll,
    add: add,
    update: update,
    delete: remove
};