const path = require('path');
const router = require('express').Router();
const allowMethods = require('allow-methods');
const util = require(path.join('..', 'util'));
const users = require(path.join(__dirname, '..', '..', 'data', 'users'));
const validateNewUser = require(path.join(__dirname, '..', '..', 'middleware', 'validateNewUser'));
const encryptPassword = require(path.join(__dirname, '..', '..', 'middleware', 'encryptPassword'));
const basicauth = require(path.join(__dirname, '..', '..', 'middleware', 'basicauth'));

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
