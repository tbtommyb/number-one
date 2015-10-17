var express = require('express'),
    path = require('path'),
    auth = require('basic-auth'),
    favicon = require('serve-favicon'),
    jwt = require('jwt-simple'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    sqlite3 = require('sqlite3');

var config = require('./config');
var Bcrypt = require('./data/bcrypt');
var User = require('./data/users');

var app = express();

var apiRouter = express.Router();

//Static content and favicon
app.use("/public", express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/favicon.ico'));

//Config
var port = process.env.PORT || 9000;
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
apiRouter.all('*', function(req, res, next) {
	req.db = db;
	next();
});

// To do - move bcrypt to here from user

apiRouter.all('*', function(req, res, next) {
	if (req.query.password) {
		Bcrypt.encrypt(req, function(err, req){
			if (err) {
				next(err);
			}
			else {
				next();
			}
		});
	}
});
// Public-facing routes -----------

apiRouter.get('/', function(req, res) {
	res.send('You connected to the API!');
});

apiRouter.get('/records', function(req, res) {
	db.all("SELECT rowid, * FROM Data", function(err, row) {
		if (err) {
			throw err;
		}
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

apiRouter.get('/records/:reqDate/', function (req, res) {
	var reqDate = req.params.reqDate;
	db.get("SELECT * FROM Data WHERE date <= ? ORDER BY id DESC LIMIT 1", reqDate, function(err, row) {
		if (err) {
			throw err;
		}
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

// Create user if doesn't already exist
// TO DO - incorporate basic auth for this route

apiRouter.get('/adduser', function(req, res) {
	if (req.query.name && req.query.password) {
		var user = new User({
			name: req.query.name,
			password: req.query.password,
			admin: req.query.admin
		});
		// check that user doesn't exist first
		user.get(req, function (err,userExists) {
			if (err) {
				throw err;
			}
			if (userExists) {
				res.send('The user already exists!');
			} else {
				user.add(req, function(err, isAdded) {
					if (err) {
						throw err;
					}
					res.status(201).send({success: true, message: 'Record created'});
				});
			}
		});
	} else {
		res.status(400).send({
			success: false,
			message: 'Please provide name and password.'
		});
	}
});

// POST route to authenticate the user

//apiRouter.get('/authenticate', function(req, res) {
	
	// find user
	/*User.findOne({
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
					var token = jwt.encode(user.name, app.get('superSecret'));

					res.json({
						success: true,
						message: 'Token delivered',
						token: token
					});
				}
			});
		}
	});*/
//});

// Restricted routes ---------------------
// Middleware to verify the user's token before doing restricted routes

apiRouter.use(function(req, res, next) {

	var token = req.body.token || req.query.token || req.header['X-Access-Token'];

	if (token) {
		req.decoded = jwt.decode(token, app.get('superSecret'));
		next();
	}
	else {
		return res.status(401).send({
			succes: false,
			message: 'Please provide a valid token'
		});
	}
});

// Return all users

apiRouter.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

// POST route to add new records.

apiRouter.post('/records', function (req, res) {
	if (!req.body) {
		res.status(400).send({
			success: false,
			message: 'Date, artist, title and week data not in correct format'
		});
	}
	var recordData = [
		req.body.date,
		req.body.artist.toUpperCase(),
		req.body.title.toUpperCase(),
		req.body.weeks
	];
	// Check that it doesn't already exist
	db.get("SELECT rowid, * FROM Data WHERE date = ?", recordData[0], function(err, row) {
		if (err) {
			throw err;
		}
		if (row) {
			res.status(409).send({
				success: false,
				message: 'A record with that date already exists.'
			});
		} else if (!row) {
			db.run("INSERT INTO Data VALUES (?, ?, ?, ?)", recordData, function(err, row){
				if (err) {
					throw err;
				}
				res.status(201).send({success: true, message: 'Record created'});
			});
		}
	});
});


// PUT route to update existing records

apiRouter.put('/records', function (req, res) {
	if (!req.body.rowid) {
		res.status(400).send({
			success: false,
			message: 'Record updates need the row ID'
		});
	}
	var recordData = [
		req.body.date,
		req.body.artist.toUpperCase(),
		req.body.title.toUpperCase(),
		req.body.weeks,
		req.body.rowid
	];
	// Check that it exists first
	db.get("SELECT rowid, * FROM Data WHERE date = ?", recordData[0], function(err, row) {
		if (err) {
			throw err;
		}
		if (!row) {
			res.status(204).send({
				success: false,
				message: 'Record not found'
			});
		} else if (row) {
			db.run("UPDATE Data SET artist = ?, title = ?, weeks = ? WHERE rowid = ?",
				recordData.slice(1), function(err) {
					if (err) {
						throw err;
					} else {
						res.status(200).send('Record updated successfully');
					}
				}
			);
		}
	})
});

// DELETE route 

apiRouter.delete('/records', function (req, res) {
	// Date needed in request to query database
	if (!req.body.date) {
		res.status(400).send({
			success: false,
			message: 'Please provide a date'
		});
	}
	var dateQuery = req.body.date;
	// To do - Regex here to make sure it's a valid datestring
	db.get("SELECT rowid, * FROM Data WHERE date = ?", dateQuery, function(err, row) {
		if (err) {
			throw err;
		}
		if (!row) {
			res.status(204).send({
				success: false,
				message: 'Record not found'
			});
		} else if (row) {
			db.run("DELETE FROM Data WHERE date = ?", dateQuery, function(err){
				if (err) {
					throw err;
				}
				res.status(200).send({
					success: true,
					message: 'Record successfully deleted'
				});
			});
		}
	});
});

app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
