var router = require('express').Router();
var allowMethods = require('allow-methods');
var users = require('../users.js');
var encryptPassword = require('../../middleware/encryptPassword.js');

router.route('/')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(users.getAll);

router.route('/:name')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get(users.getOne);

router.route('/:name')
    .all(allowMethods(['put'], 'Please use PUT method'))
    .put(encryptPassword, users.update);

router.route('/:name')
    .all(allowMethods(['delete'], 'Please use DELETE method'))
    .delete(users.delete);

module.exports = router;
