/* jslint node: true */

'use strict';

var db = require('../db.js')();

module.exports = {

    checkExists: function (date, callback) {
        db.get("SELECT rowid, * FROM Data WHERE date = ?", date, function (err, exists) {
            if (err) {
                return callback(err);
            }
            if (exists) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    checkRow: function (rowid, callback) {
        db.get("SELECT rowid, * FROM Data WHERE rowid = ?", rowid, function (err, exists) {
            if (err) {
                return callback(err);
            }
            if (exists) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    getAll: function (callback) {
        db.all("SELECT rowid, * FROM Data", function (err, rows) {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    },

    get: function (date, callback) {
        db.get("SELECT rowid, * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1", date, function (err, row) {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    },

    create: function (data, callback) {
        db.run("INSERT INTO Data VALUES (?, ?, ?, ?)", data, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
    },

    update: function (input, callback) {
        db.run("UPDATE Data SET date = ?, artist = ?, title = ?, weeks = ? WHERE rowid = ?", input, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
    },

    delete: function (date, callback) {
        db.run("DELETE FROM Data WHERE date = ?", date, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
    }
};

