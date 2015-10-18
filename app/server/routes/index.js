/* jslint node: true, nomen: true */

var express = require('express');

module.exports = function () {

    'use strict';

    var router = express.Router();

    // Serve the client route ------------

    router.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    return router;
};