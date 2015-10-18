'use strict';

var records = {

    getAll: function (req, res) {
        req.db.all("SELECT rowid, * FROM Data", function (err, row) {
            if (err) {
                throw err;
            }
            res.contentType('application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(row);
        });
    },

    getOne: function (req, res) {
        var reqDate = req.params.reqDate;
        req.db.get("SELECT * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1", reqDate, function (err, row) {
            if (err) {
                throw err;
            }
            res.contentType('application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(row);
        });
    },

    create: function (req, res) {
        if (!req.body) {
            res.status(400).send({
                success: false,
                message: 'Date, artist, title and week data not in correct format'
            });
        }
        var recordData = [
            req.body.date,
            req.body.artist.toUpperCase(),
            req.body.title.toUpperCase(),
            req.body.weeks
        ];
        // Check that it doesn't already exist
        req.db.get("SELECT rowid, * FROM Data WHERE date = ?", recordData[0], function (err, row) {
            if (err) {
                throw err;
            }
            if (row) {
                res.status(409).send({
                    success: false,
                    message: 'A record with that date already exists.'
                });
            } else if (!row) {
                db.run("INSERT INTO Data VALUES (?, ?, ?, ?)", recordData, function (err, row) {
                    if (err) {
                        throw err;
                    }
                    res.status(201).send({success: true, message: 'Record created'});
                });
            }
        });
    },

    update: function (req, res) {
        if (!req.body.rowid) {
            res.status(400).send({
                success: false,
                message: 'Record updates need the row ID'
            });
        }
        var recordData = [
            req.body.date,
            req.body.artist.toUpperCase(),
            req.body.title.toUpperCase(),
            req.body.weeks,
            req.body.rowid
        ];
        // Check that it exists first
        req.db.get("SELECT rowid, * FROM Data WHERE rowid = ?", recordData[4], function (err, row) {
            if (err) {
                throw err;
            }
            if (!row) {
                res.status(204).send({
                    success: false,
                    message: 'Record not found'
                });
            } else if (row) {
                db.run("UPDATE Data SET artist = ?, title = ?, weeks = ? WHERE rowid = ?",
                    recordData.slice(1), function (err) {
                        if (err) {
                            throw err;
                        }
                        res.status(200).send('Record updated successfully');
                    });
            }
        });
    },

    delete: function (req, res) {
        // Date needed in request to query database
        if (!req.body.date) {
            res.status(400).send({
                success: false,
                message: 'Please provide a date'
            });
        }
        var dateQuery = req.body.date;
        // To do - Regex here to make sure it's a valid datestring
        req.db.get("SELECT rowid, * FROM Data WHERE date = ?", dateQuery, function (err, row) {
            if (err) {
                throw err;
            }
            if (!row) {
                res.status(204).send({
                    success: false,
                    message: 'Record not found'
                });
            } else if (row) {
                db.run("DELETE FROM Data WHERE date = ?", dateQuery, function (err) {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send({
                        success: true,
                        message: 'Record successfully deleted'
                    });
                });
            }
        });
    }
}

module.exports = records;