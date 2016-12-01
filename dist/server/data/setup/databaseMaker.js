const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const file = path.join(__dirname, 'data.db');
const exists = fs.existsSync(file);

const inputData = JSON.parse(fs.readFileSync(path.join(__dirname, 'newData.json'), 'utf8'));

if (!exists) {
    console.log('Creating new DB file.');
    fs.openSync(file, 'w');
}

const db = new sqlite3.Database(file);

db.serialize(function() {
    if (!exists) {
        db.run('CREATE TABLE Data (id INT, date TEXT, title TEXT, artist TEXT, weeks INT)');
    }

    const stmt = db.prepare('INSERT INTO Data (id, date, title, artist, weeks) VALUES (?, ?, ?, ?, ?)');

    inputData.forEach((line, i) => {
        stmt.run(i, line.Date, line.Title, line.Artist, line.Weeks);
    });

    stmt.finalize();

    db.each('SELECT * FROM Data', function(err, row) {
        console.log(row);
    });
});

db.close();
