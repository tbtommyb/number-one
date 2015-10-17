function User (attr) {
	this.name = attr.name || '';
	this.password = attr.password || '';
	this.admin = attr.admin || false;
	this.rowid = attr.rowid || undefined;
};

User.prototype.get = function (req, callback) {
	var user = this;
	req.db.get("SELECT rowid, * FROM Users WHERE name= ?", user.name, function(err, row) {
		if (err) {
			return callback(err);
		}
		if (!row) {
			callback(null, false);
		}
		else if (row) {
			callback(null, row);
		}
	});
};

User.prototype.add = function(req, callback) {
	var user = this;
	var values = [user.name, user.password, user.admin];
	req.db.run("INSERT INTO Users VALUES (?, ?, ?)", values, function(err, row) {
		if (err) {
			return callback(err);
		}
		callback(null, true);
	});
};

User.prototype.update = function(req, res) {
	var values = [this.name, this.password, this.admin, this.rowid];
	req.db.run("UPDATE Users SET name = ?, password = ?, admin = ? WHERE rowid = ?",
		values, function(err) {
			if (err) {
				throw err;
			} else {
				res.status(200).send('Record updated successfully');
			}
		}
	);
};

module.exports = User;