var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    jwt = require('jwt-simple'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    sqlite3 = require('sqlite3');

var config = require('./config');
var User = require('./data/users');

var app = express();

var apiRouter = express.Router();

//Static content and favicon
app.use("/public", express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/favicon.ico'));

//Config
var port = process.env.PORT || 9000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

// Record database stuff
var file = __dirname + '/data/data.db';
var db = new sqlite3.Database(file);

// Serve the client route ------------

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// API route ====================

app.use('/api', apiRouter);

// Public-facing routes -----------

apiRouter.get('/', function(req, res) {
	res.send('You connected to the API!');
});

apiRouter.get('/records', function(req, res) {
	db.all("SELECT * FROM Data", function(err, row) {
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

apiRouter.get('/records/:reqDate/', function (req, res) {
	var reqDate = req.params.reqDate;
	db.get("SELECT * FROM Data WHERE date <= ? ORDER BY id DESC LIMIT 1", reqDate, function(err, row) {
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

// Create initial admin user if doesn't already exist

apiRouter.get('/setup', function(req, res) {
	User.count({name: 'admin'}, function(err, count){
		if (count > 0) {
			res.send('Admin user already exists');
		}
		else {
			var admin = new User({
				name: 'admin',
				password: req.query.pword,
				admin: true
			});
			admin.save(function(err) {
				if (err) {
					throw err;
				}
				console.log('User saved');
				res.json({ success: true });
			});
		}
	});
});

// POST route to authenticate the user

apiRouter.post('/authenticate', function(req, res) {
	var name = req.query.name;
	var password = req.query.pword;
	// find user
	User.findOne({
		name: name
	}, function (err, user) {
		if (err) {
			throw err;
		}
		if (!user) {
			res.json({success: false, message: 'Authentication failed. User not found'});
		}
		else if (user) {
			// check password
			user.comparePassword(password, function(err, isMatch){
				if (err) {
					throw err;
				}
				if (!isMatch) {
					res.json({success: false, message: 'Authentication failed. Incorrect password'});
				}
				else if (isMatch) {
				// create the token
					var token = jwt.encode(user, app.get('superSecret'));

					res.json({
						success: true,
						message: 'Token delivered',
						token: token
					});
				}
			});
		}
	});
});

// Restricted routes ---------------------
// Middleware to verify the user's token before doing restricted routes

apiRouter.use(function(req, res, next) {

	var token = req.body.token || req.query.token || req.header['X-Access-Token'];

	if (token) {
		req.decoded = jwt.decode(token, app.get('superSecret'));
		next();
	}
	else {
		return res.status(403).send({
			succes: false,
			message: 'No token provided.'
		});
	}
});

// Return all users

apiRouter.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

// POST route to add new records. Return '201 (created)'
// Need to make the ID value come automatically into the table

apiRouter.post('/records/', function (req, res) {
	if (!req.body) {
		res.json({success: false, status: 400});
	}
	var recordData = [,
		req.body.date,
		req.body.artist,
		req.body.title,
		req.body.weeks
	];
	db.run("INSERT INTO Data VALUES (?, ?, ?, ?, ?)", recordData, function(err, row){
		if (err) {
			throw err;
		}
		res.send({success: true, status: '201: record created'});
	});
});


// To do - PUT route to update existing records. Return '200 OK or 204 Not found'

apiRouter.put('/records/:reqDate/', function (req, res) {
	var reqDate = req.params.reqDate;
});

// To do - DELETE route. Return 200 OK or 404 not found

apiRouter.delete('/records/:reqDate/', function (req, res) {
	var reqDate = req.params.reqDate;
});

app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
