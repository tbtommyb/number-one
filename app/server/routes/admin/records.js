var router = require('express').Router();
var validateDate = require('../../middleware/validateDate.js');
var validateNewRecord = require('../../middleware/validateNewRecord.js');
var validateUpdateRecord = require('../../middleware/validateUpdateRecord.js');
var allowMethods = require('allow-methods');
var records = require(__dirname + '/../../data/records.js');
var util = require('../util');

/* TO FIX - router can't tell date and rowid apart
 * Post shouldn't use date, others can use ID */
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
    .delete(validateDate, (req, res) => {
        records.delete(req.params.rowid, util.handleChange(req, res));
    });

module.exports = router;
