'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/*
* user middleware
* */
exports.userByUsername = function(req, res, next, username) {

var user = req.user;
  console.log('userByUsername ' + user);

User.findOne({
    username: username
}, '_id displayName username created').exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + username));
    req.user = user;
    res.json(user);
    next();
});
};


exports.read = function(req, res, next, username) {

var user = req.user;
  console.log('userByUsername ' + user);
};


/*
* user email middleware
* */
exports.userByEmail = function(req, res, next, email) {
  console.log('userByEmail ' + email);
  User.findOne({
    email: email
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User with email ' + email));
    res.json(user);
    next();
  });
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};