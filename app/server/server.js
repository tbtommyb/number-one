/* jslint node: true, nomen: true */

'use strict';

var express = require('express'),
    path = require('path'),
    auth = require('basic-auth'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    https = require('https'),
    fs = require('fs'),
    sqlite3 = require('sqlite3');

var api = require('./routes/api.js');
var router = require('./routes/web.js');

// Initial setup
var app = express();

app.use(helmet());

//Static content and favicon
app.use("/public", express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/favicon.ico'));

//Config
var port = process.env.PORT || 9000;

app.set('superSecret', require('./config.js')); // For JWT

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

// Load the user and record database
var file = path.join(__dirname, '..', 'data/data.db');
var db = new sqlite3.Database(file);

// HTTPS setup

var httpsPort = 3443;

var httpsOptions = {
    key: fs.readFileSync(__dirname + '/private.key'),
    cert: fs.readFileSync(__dirname + '/certificate.pem')
};

app.set('port_https', httpsPort);

// Routing -----------------

// Put everything through HTTPS

app.all('*', function (req, res, next) {
    if (req.secure) {
        req.db = db;
        return next();
    };
    res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});

// API route

//api.all('*', require('./middleware/validate'));
app.use('/api', api);

// Open index route
app.use('/', router);

var secureServer = https.createServer(httpsOptions, app).listen(httpsPort);
var server = app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
