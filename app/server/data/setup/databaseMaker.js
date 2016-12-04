const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const file = path.join(__dirname, process.argv[2]);
const exists = fs.existsSync(file);

const inputData = JSON.parse(fs.readFileSync(path.join(__dirname, 'newData.json'), 'utf8'));

if (!exists) {
    console.log('Creating new DB file.');
    fs.openSync(file, 'w');
}

const db = new sqlite3.Database(file);

db.serialize(function() {
    if (!exists) {
        db.run('CREATE TABLE Data (date TEXT NOT NULL, title TEXT NOT NULL, artist TEXT NOT NULL, weeks INT NOT NULL);');
        db.run('CREATE TABLE Users (password TEXT NOT NULL, admin BOOLEAN, name TEXT PRIMARY KEY UNIQUE NOT NULL);');
    }

    const stmt = db.prepare('INSERT INTO Data (date, title, artist, weeks) VALUES (?, ?, ?, ?);');

    inputData.forEach(line => {
        stmt.run(line.Date, line.Title, line.Artist, line.Weeks);
    });

    stmt.finalize();
});

db.close();
