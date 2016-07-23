var Customer = require('../models/customer.js');
var customerViewModel = require('../viewModels/customer.js');
var User = require('../models/user.js');
var bcrypt = require('bcryptjs');

module.exports = {

	registerRoutes: function(app) {
		app.get('/customer/register', this.register);
		app.post('/customer/register', this.processRegister);

		app.get('/customer/:id', this.home);
		app.get('/customer/:id/preferences', this.preferences);
		app.get('/orders/:id', this.orders);

		app.post('/customer/:id/update', this.ajaxUpdate);
	},

	register: function(req, res, next) {
		res.render('customer/register');
	},

	processRegister: function(req, res, next) {
		// TODO: back-end validation (safety)
		// var c = new Customer({
		// 	firstName: req.body.firstName,
		// 	lastName: req.body.lastName,
		// 	email: req.body.email,
		// 	address1: req.body.address1,
		// 	address2: req.body.address2,
		// 	city: req.body.city,
		// 	state: req.body.state,
		// 	zip: req.body.zip,
		// 	phone: req.body.phone,
		// 	user: 
		// });
		// c.save(function(err) {
		// 	if(err) return next(err);
		// 	res.redirect(303, '/customer/' + c._id);
		// });
var tempUser = req.body;
console.log(tempUser)
User.findOne({$or: [{
                email: req.body.email
            }, {
                username: req.body.username
            }]
    },function(users) {
                    console.log(tempUser)

        if (users) {
            console.log(users)
            res.render("users/taken");
        } else {
        	console.log('hi')
			console.log(tempUser)

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {

                	console.log(hash)
                    tempUser.password = hash;
                    console.log(tempUser)
                    var newUser = new User (tempUser);
                    newUser.save(function(err,user) {
                    	if (err) {
                    		console.log(err)
                    	} else {
                    	console.log(user)
                        req.session.logged_in = true;
                        req.session.user_id = user._id;
                        req.session.user_email = user.email;
                        req.session.username = user.username;
                        res.redirect('/');
                    	}

                    });
                });
            });
        }
    });
	},

	home: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/home', customerViewModel(customer, orders));
			});
		});
	},

	preferences: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/preferences', customerViewModel(customer, orders));
			});
		});
	},

	orders: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/preferences', customerViewModel(customer, orders));
			});
		});
	},

	ajaxUpdate: function(req, res) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			if(req.body.firstName){
				if(typeof req.body.firstName !== 'string' ||
					req.body.firstName.trim() === '')
					return res.json({ error: 'Invalid name.'});
				customer.firstName = req.body.firstName;
			}
			// and so on....
			customer.save(function(err) {
				return err ? res.json({ error: 'Unable to update customer.' }) : res.json({ success: true });
			});
		});
	},
};
