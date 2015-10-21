/* jslint node: true */

var db = require('../server/db.js')();

'use strict';

module.exports = {

    checkExists: function(userObj, callback) {
        db.get("SELECT rowid, * FROM Users WHERE name = ?", userObj.name, function (err, exists) {
            if (err) {
                return callback(err);
            }
            if (exists) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });   
    },

    get: function (name, callback) {
        db.get("SELECT rowid, * FROM Users WHERE name = ?", name, function (err, row) {
            if (err) {
                return callback(err);
            }
            if (!row) {
                callback(null, false);
            } else if (row) {
                callback(null, row);
            }
        });
    },

    getAll: function (callback) {
        db.all("SELECT rowid, * FROM Users", function (err, rows) {
            if (err) {
                return callback(err);
            }
            if (!rows) {
                callback(null, false);
            } else if (rows) {
                callback(null, rows);
            }
        });
    },

    add: function (input, callback) {
        var values = [input.name, input.password, input.admin];
        db.run("INSERT INTO Users VALUES (?, ?, ?)", values, function (err, row) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
    },

    update: function (input, callback) {
        var values = [input.name, input.password, input.admin, input.rowid];
        db.run("UPDATE Users SET name = ?, password = ?, admin = ? WHERE rowid = ?",
            values, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, true);
            });
    },

    delete: function (rowID, callback) {
        db.run("DELETE FROM Users WHERE rowID = ?", rowID, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });

    }
};