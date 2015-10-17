// this bit is broken   ----vvvvvv
function User (attr) {
	this.name = attr.name || '';
	this.password = attr.password || '';
	this.admin = attr.admin || false;
};

User.prototype.get = function (callback) {
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

User.prototype.add = function(callback) {
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
	var values = [req.query.name, req.query.password, req.query.admin, req.query.rowid];
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

/*var UserSchema = new Schema({
	name: String,
	password: String,
	admin: Boolean
});

UserSchema.pre('save', function(next){
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	var user = this;

	bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		console.log(isMatch);
		cb(null, isMatch);
	});
};*/

//module.exports = mongoose.model('User', UserSchema);