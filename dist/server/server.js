var express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    rateLimit = require('express-rate-limit'),
    helmet = require('helmet');

var api = require('./routes/api.js');
var router = require('./routes/web.js');

// Initial setup
var app = express();
var port = process.env.PORT || 9000;

// Rate limiter

app.enable('trust proxy');

var limiter = rateLimit({
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
    res.setHeader("Content-Security-Policy", "default-src 'self' https://www.googleapis.com/ https://www.youtube.com/ https://s.ytimg.com/ 'unsafe-eval'");
    return next();
});

// maxAge to enable caching
app.use(express.static(__dirname + '/../', { maxAge: 31536001 }));
app.use(favicon(__dirname + '/favicon.ico'));

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

/*app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});*/

// Routing -----------------

// API route

app.use('/api', api);

// Web route
app.use('/', router);

//var secureServer = https.createServer(httpsOptions, app).listen(httpsPort);
var server = app.listen(port);