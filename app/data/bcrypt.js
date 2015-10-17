var bcrypt = require('bcrypt');

var encrypt = function(req, callback) {
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

module.exports = encrypt;