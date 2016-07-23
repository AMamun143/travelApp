var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	authId: String,
	firstName: String,
	lastName: String,
	email: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: String,
	phone: String,
	username: String,
	password: String,
	created: Date,
});

var User = mongoose.model('User', userSchema);
module.exports = User;
