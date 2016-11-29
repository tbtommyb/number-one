var router = require('express').Router();
var allowMethods = require('allow-methods');
var users = require(__dirname + '/../../data/users.js');
var validateNewUser = require('../../middleware/validateNewUser.js');
var encryptPassword = require('../../middleware/encryptPassword.js');
var util = require('../util');

router.route('/')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get((req, res) => {
        users.getAll(util.serveRows(req, res));
    });

router.route('/:name')
    .all(allowMethods(['get'], 'Please use GET method'))
    .get((req, res) => {
        users.get(req.params.name, util.serveRows(req, res));
    });

router.route('/:name')
    .all(allowMethods(['put'], 'Please use PUT method'))
    .put(encryptPassword, validateNewUser, (req, res) => {
        users.update(req.newUser, util.handleChange(req, res));
    });

router.route('/:name')
    .all(allowMethods(['delete'], 'Please use DELETE method'))
    .delete((req, res) => {
        users.delete(req.params.name, util.handleChange(req, res));
    });

module.exports = router;
