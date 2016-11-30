const path = require('path');
const router = require('express').Router();
const allowMethods = require('allow-methods');
const util = require(path.join('..', 'util'));
const records = require(path.join(__dirname, '..', '..', 'data', 'records'));
const validateDate = require(path.join(__dirname, '..', '..', 'middleware', 'validateDate'));
const validateNewRecord = require(path.join(__dirname, '..', '..', 'middleware', 'validateNewRecord'));
const validateUpdateRecord = require(path.join(__dirname, '..', '..', 'middleware', 'validateUpdateRecord'));

router.route('/')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(validateDate, validateNewRecord, (req, res) => {
        records.create(req.recordData, util.handleInsert(req, res));
    });

router.route('/:rowid')
    .all(allowMethods(['put', 'delete'], 'Please use PUT or DELETE method'))
    .put(validateDate, validateUpdateRecord, (req, res) => {
        records.update(req.recordData, util.handleChange(req, res));
    })
    .delete((req, res) => {
        records.delete(req.params.rowid, util.handleChange(req, res));
    });

module.exports = router;
