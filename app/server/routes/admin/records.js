var router = require('express').Router();
var valiDate = require('../../middleware/validateDate.js');
var allowMethods = require('allow-methods');
var record = require(__dirname + '/../../data/records.js');

router.route('/:date')
    .all(allowMethods(['post'], 'Please use POST method'))
    .post(valiDate, record.create);

router.route('/:rowid')
    .all(allowMethods(['put'], 'Please use PUT method'))
    .put(valiDate, record.update);

router.route('/:date')
    .all(allowMethods(['delete'], 'Please use DELETE method'))
    .delete(valiDate, record.delete);

module.exports = router;
