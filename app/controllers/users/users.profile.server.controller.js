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
*	user middleware find associated recipes
*
* 	`listUserRecipes`
* 
*  */

// exports.listUserRecipes = function(req, res, next, username) {

// 	var user = req.user;

// 	var vm, objArray;

// 	User.find().sort(-created).populate('recipes', 'user').exec(function(err, recipes) {
// 		if (err) {
// 			console.log('user recipe list error.');
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			console.log('user recipe list success.');
// 			res.jsonp(recipes);
// 		}
// 	});
// };





/*


a reference:

/**
 * http://mongoosejs.com/docs/populate.html
 * List of Recipes
 */
// exports.list = function(req, res) { 
// 	Recipe.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
// 		if (err) {
// 			console.log('List error.');
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			console.log('List successful.');
// 			res.jsonp(recipes);
// 		}
// 	});
//};






/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};