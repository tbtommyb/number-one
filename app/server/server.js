const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const apiRoute = require('./routes/api.js');
const webRoute = require('./routes/web.js');

/*** Initial setup ***/
const app = express();

/*** Middleware ***/

// Rate limiter
app.enable('trust proxy');

const limiter = rateLimit({
    windowMs: 30000,
    delayAfter: 0,
    delayMs: 0,
    max: 100
});

app.use(limiter);

//Static content and favicon
app.use(compression());
app.use(helmet());

// Content Security Policy
app.use(function(req, res, next) {
    res.setHeader('Content-Security-Policy', "default-src 'self' https://www.googleapis.com/ https://www.youtube.com/ https://s.ytimg.com/ 'unsafe-eval'");
    return next();
});

// maxAge to enable caching
app.use(express.static(__dirname + '/../', { maxAge: 31536001 }));
app.use(favicon(__dirname + '/favicon.ico'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*** Routing ***/
app.use('/', webRoute);
app.use('/api', apiRoute);

/*** Initialise ***/
const port = process.env.PORT || 9000;
const server = app.listen(port);

module.exports = server;
