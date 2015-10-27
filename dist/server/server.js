/* jslint node: true, nomen: true */

'use strict';

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    https = require('https'),
    fs = require('fs');

var api = require('./routes/api.js');
var router = require('./routes/web.js');

// Initial setup
var app = express();
var port = process.env.PORT || 9000;

//Static content and favicon
app.use(express.static(__dirname + '/../'));
app.use(favicon(__dirname + '/favicon.ico'));

//Middleware

app.use(helmet());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* HTTPS setup - not needed using Heroku
var httpsPort = 3443;

var httpsOptions = {
    key: fs.readFileSync(__dirname + '/private.key'),
    cert: fs.readFileSync(__dirname + '/certificate.pem')
};

app.set('port_https', httpsPort);*/

// Put everything through HTTPS

app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.hostname + req.url);
});

// Routing -----------------

// API route

app.use('/api', api);

// Web route
app.use('/', router);

// Make better error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send('An error occurred, sorry!');
});

//var secureServer = https.createServer(httpsOptions, app).listen(httpsPort);
var server = app.listen(port);