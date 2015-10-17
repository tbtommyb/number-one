var bcrypt = require('bcrypt');

exports.encrypt = function encrypt (req, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return callback(err);
		}
		bcrypt.hash(req.query.password, salt, function(err, hash) {
			if (err) {
				return callback(err);
			}
			req.query.password = hash;
			callback(null, req);
		});
	});
};

exports.comparePassword = function(user, candidatePassword, cb) {
	bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

