var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/register');

router.get('/login', function(req, res){
	res.render('user/login', { title: 'my other page', layout: 'login' });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, users){
   	if(err) throw err;
   	if(!users){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, users.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, users);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(users, done) {
  done(null, users.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, users) {
    done(err, users);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/administrator', failureRedirect:'/user/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/administrator');
  });

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/user/login');
});
module.exports = router;
