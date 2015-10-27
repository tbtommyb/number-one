'use strict';

var recordDB = require('../../data/recordDB');

module.exports = {

    getAll: function (req, res, next) {
        recordDB.getAll(function (err, rows) {
            if (err) {
                return next(err);
            }
            res.contentType('application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(rows);
        });
    },

    get: function (req, res, next) {
        recordDB.get(req.params.date, function (err, rows) {
            if (err) {
                return next(err);
            }
            res.contentType('application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(rows);
        });
    },

    create: function (req, res, next) {
        if (req.body.artist && req.body.title && req.body.weeks) {
            var recordData = [
                req.params.date,
                req.body.artist.toUpperCase(),
                req.body.title.toUpperCase(),
                req.body.weeks
            ];
            // Check that it doesn't already exist
            recordDB.checkExists(req.params.date, function (err, exists) {
                if (err) {
                    return next(err);
                }
                if (exists) {
                    res.status(409).send({
                        success: false,
                        message: 'A record with that date already exists.'
                    });
                } else {
                    recordDB.create(recordData, function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.status(201).send({
                            success: true,
                            message: 'Record created'
                        });
                    });
                }
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Date, artist, title and week data not in correct format'
            });
        }
    },

    update: function (req, res, next) {
        if (req.body.date && req.body.artist && req.body.title && req.body.weeks) {
            var recordData = [
                req.body.date,
                req.body.artist.toUpperCase(),
                req.body.title.toUpperCase(),
                req.body.weeks,
                req.params.rowid
            ];
            // Check that it exists first
            recordDB.checkRow(req.params.rowid, function (err, exists) {
                if (err) {
                    return next(err);
                }
                if (!exists) {
                    res.status(404).send({
                        success: false,
                        message: 'The record was not found.'
                    });
                } else {
                    recordDB.update(recordData, function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.status(201).send({
                            success: true,
                            message: 'Record updated'
                        });
                    });
                }
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Date, artist, title and week data not in correct format'
            });
        }
    },

    delete: function (req, res, next) {
        recordDB.checkExists(req.params.date, function (err, exists) {
            if (err) {
                return next(err);
            }
            if (!exists) {
                res.status(404).send({
                    success: false,
                    message: 'Record not found'
                });
            } else {
                recordDB.delete(req.params.date, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({
                        success: true,
                        message: 'Record successfully deleted'
                    });
                });
            }
        });
    }
};

