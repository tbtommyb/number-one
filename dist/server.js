var express = require('express'),
    path = require('path'),
    sql = require('sqlite3'),
    sqlite3 = require('sqlite3');

var app = express();

//Where to serve static content
app.use(express.static( path.join(__dirname, 'site') ) );

//Start server
var port = process.env.PORT || 9000;

//Database stuff

var file = __dirname + '/data/data.db';
var db = new sqlite3.Database(file);

//Routes

app.get('/api', function(req, res) {
	res.send('You connected to the API!');
});

app.get('/api/records', function(req, res) {
	db.all("SELECT * FROM Data", function(err, row) {
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

app.get('/api/records/:reqDate/', function (req, res) {
	var reqDate = req.params.reqDate;
	db.get("SELECT * FROM Data WHERE date <= '" + reqDate + "' ORDER BY id DESC LIMIT 1", function(err, row) {
		res.contentType('application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(row);
	});
});

app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
