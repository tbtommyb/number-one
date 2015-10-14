var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
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
};

module.exports = mongoose.model('User', UserSchema);