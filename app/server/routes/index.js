'use strict';

var express = require('express');

var router = express.Router();

// Serve the client route ------------

router.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + '/public/index.html');
});

module.exports = router;