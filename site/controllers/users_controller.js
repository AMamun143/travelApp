var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var session = require('express-session');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var fs = require('fs');
var keys = require('../APIkeys/sendgridKeys.js');
var sendgrid = require('sendgrid')(keys.sendgridKeys.key);
var crypto = require('crypto');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');


var User = require('../models/user.js');

router.get('/users/sign-in', function(req, res) {
    res.render('users/sign-in');
});

router.post('/users/sign-in', function(req, res) {
    console.log(req.body.username)
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            console.log(err)
        } else {
        console.log(user);
        if (user == null) {
            res.render("users/not-found");
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (result == true) {
                    req.session.logged_in = true;
                    req.session.user_id = user.id;
                    req.session.user_email = user.email;
                    req.session.username = user.username;
                    res.redirect('/');
                } else {
                    res.render("users/password-incorrect");
                }
            });
        }
        }

    })
});

router.get('/users/sign-out', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/')
    })
});

router.get('/users/new', function(req, res) {
    res.render('users/new');
});

//user reset password

router.get('/users/forgot', function(req, res) {
    res.render('users/forgot', {
        user: req.user
    });
});

router.post('/users/forgot', function(req, res) {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user == null) {
            res.render("users/not-found");
        } else {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                user.resetPasswordToken = token;
                sequelize.query("UPDATE users SET resetPasswordToken=':" + token + "' WHERE email='" + req.body.email + "';");
                sequelize.query("UPDATE users SET resetPasswordExpires=DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email='" + req.body.email + "';");
                sendgrid.send({
                    to: req.body.email,
                    from: 'noreply@discoverusa.app',
                    subject: 'Discover USA Password Reset',
                    html: '<p>Click on the link to reset your password: http://localhost:3000/users/reset/:' + token + '<br><br>This is an automtically generated email. Replies to this email address will go nowhere.'

                }, function(err, json) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(json);
                }); //end sendgrid
            }); //end crypto
            res.render("users/email-sent");
        } //end else statement
    }); //end user.findOne().then()
}); //end users forgot post route

router.get('/users/reset/:token', function(req, res) {
    User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }
    }).then(function(result) {
        var hbsObject = {
            user: result
        }
        if (hbsObject == null) {
            res.render("users/bad-token");
        } else {
            res.render('users/reset', hbsObject);
        }
    });
}); //end route

router.post('/users/reset', function(req, res) {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user == null) {
            res.render("users/not-found");
        } else {
            if (req.body.newPassword == req.body.confirmPassword) {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                        sequelize.query("UPDATE users SET password_hash='" + hash + "' WHERE email='" + user.email + "';");
                    });
                });
                //write code to log user in and show success message
                req.session.logged_in = true;
                req.session.user_id = user.id;
                req.session.user_email = user.email;
                req.session.username = user.username;
                res.redirect('/');
            } else {
                res.render("users/password-error");
            }
        }
    });
});

module.exports = router;
