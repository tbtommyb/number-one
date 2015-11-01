/* jslint node: true, nomen: true */

module.exports = (function () {

    'use strict';

    var express = require('express');
	var path = require('path');

    var router = express.Router();

    // Serve the client route ------------

    router.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../index.html'));
    });

    return router;
}());