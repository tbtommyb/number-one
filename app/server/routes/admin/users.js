var router = require('express').Router();
var allowMethods = require('allow-methods');
var users = require(__dirname + '/../../data/users.js');
var validateNewUser = require('../../middleware/validateNewUser.js');
var encryptPassword = require('../../middleware/encryptPassword.js');
var basicauth = require('../../middleware/basicauth');
var util = require('../util');

router.route('/')
    .all(allowMethods(['get', 'put'], 'Please use GET or PUT method'))
    .get((req, res) => {
        users.get(util.serveRows(req, res));
    })
    .put(basicauth, encryptPassword, validateNewUser, (req, res) => {
        users.update(req.newUser, util.handleChange(req, res));
    });

router.route('/:name')
    .all(allowMethods(['get', 'delete'], 'Please use GET or DELETE method'))
    .get((req, res) => {
        users.getByName(req.params.name, util.serveRows(req, res));
    })
    .delete((req, res) => {
        users.delete(req.params.name, util.handleChange(req, res));
    });

module.exports = router;
