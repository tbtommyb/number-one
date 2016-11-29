'use strict';

var db = require('./db');

/* TODO - use waterfull function to tidy these up */

var checkExists = function(date, callback) {
    db.get('SELECT rowid, * FROM Data WHERE date = ?', date, function(err, exists) {
        if (err) { return callback(err); }
        return callback(null, exists);
    });
};

var getAll = function(req, res, next) {
    db.all('SELECT rowid, * FROM Data', function (err, rows) {
        if(err) { return next(err); }
        res.contentType('application/json');
        res.json(rows);
    });
};

var get = function(req, res, next) {
    db.get('SELECT rowid, * FROM Data WHERE date <= ? ORDER BY rowid DESC LIMIT 1', req.params.date, function (err, row) {
        if(err) { return next(err); }
        res.contentType('application/json');
        res.json(row);
    });
};

var create = function(req, res, next) {
    if(!(req.body.artist && req.body.title && req.body.weeks)) {
        res.status(400).send({
            success: false,
            message: 'Date, artist, title and week data not in correct format'
        });
    }
    var recordData = [
        req.params.date,
        req.body.artist.toUpperCase(),
        req.body.title.toUpperCase(),
        req.body.weeks
    ];
    checkExists(req.params.date, function(err, exists) {
        if(err) { return next(err); }
        if(exists) {
            return res.status(409).send({
                success: false,
                message: 'A record with that date already exists.'
            });
        }
        db.run('INSERT INTO Data VALUES (?, ?, ?, ?)', recordData, function(err) {
            if(err) { return next(err); }
            res.status(201).send({
                success: true,
                message: 'Record created'
            });
        });
    });
};

var update = function(req, res, next) {
    if(!(req.body.date && req.body.artist && req.body.title && req.body.weeks)) {
        res.status(400).send({
            success: false,
            message: 'Date, artist, title and week data not in correct format'
        });
    }
    var recordData = [
        req.body.date,
        req.body.artist.toUpperCase(),
        req.body.title.toUpperCase(),
        req.body.weeks,
        req.params.rowid
    ];
    checkExists(req.body.date, function(err, exists) {
        if(err) { return next(err); }
        if(!exists) {
            return res.status(404).send({
                success: false,
                message: 'The record was not found.'
            });
        }
        db.run('UPDATE Data SET date = ?, artist = ?, title = ?, weeks = ? WHERE rowid = ?',
            recordData, function (err) {
                if(err) { return next(err); }
                res.status(201).send({
                    success: true,
                    message: 'Record updated'
                });
            });
    });
};

var remove = function(req, res, next) {
    checkExists(req.params.date, function(err, exists) {
        if(err) { return next(err); }
        if(!exists) {
            return res.status(404).send({
                success: false,
                message: 'The record was not found.'
            });
        }
        db.run('DELETE FROM Data WHERE date = ?', req.params.date, function (err) {
            if(err) { return next(err); }
            res.status(201).send({
                success: true,
                message: 'Record deleted'
            });
        });
    });
};

module.exports = {
    getAll: getAll,
    get: get,
    create: create,
    update: update,
    delete: remove
};

