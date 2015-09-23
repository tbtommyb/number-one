var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var file = __dirname + '/data.db';
var exists = fs.existsSync(file);

var inputData = JSON.parse(fs.readFileSync(__dirname + '/newData.json', 'utf8'));

if (!exists) {
	console.log("Creating new DB file.");
	fs.openSync(file, 'w');
}

var db = new sqlite3.Database(file);

db.serialize(function() {
	if (!exists) {
		db.run("CREATE TABLE Data (id INT, date TEXT, title TEXT, artist TEXT, weeks INT)");
	}

	var stmt = db.prepare("INSERT INTO Data (id, date, title, artist, weeks) VALUES (?, ?, ?, ?, ?)");

	for (var i = 0; i < inputData.length; i++) {
		var line = inputData[i];
		stmt.run(i, line.Date, line.Title, line.Artist, line.Weeks);
	}

	stmt.finalize();

	db.each("SELECT * FROM Data", function(err, row) {
		console.log(row);
	});
});

db.close();