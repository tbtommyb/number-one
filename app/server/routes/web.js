'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();

// Serve the client route ------------

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

router.use(function(err, req, res, next) {
    res.sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
});

module.exports = function() { return router; };
