'use strict';

// var path = require('path');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Recipe = mongoose.model('Recipe'),
	_ = require('lodash');

/**
 * Create a Recipe
 */
exports.create = function(req, res) {
	
	// debugging
	console.log(req.body);
	console.log(req.files);

	var recipe = new Recipe(req.body);
	recipe.user = req.user;

	recipe.likes.push(req.user._id);


	console.log('Recipe model is: ' + recipe + '\n');


	if (req.files.image) {
		// we have an img property in our `recipe` model
		recipe.image = req.files.image.path.substring(7);
		// file.path.substring(req.files.file.path.indexOf(path.sep) + path.sep.length-1);
	} else 
		// provides default image ?
		recipe.image = 'http://placehold.it/500&text=coffee';

	recipe.save(function(err)	{
		if (err)	{
			console.log('failed, server/recipe/ctrlr/create-function/: ' + errorHandler.getErrorMessage(err));

			return res.status(400).send({
				message: 	errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // makes a socket instance
			socketio.emit('recipe.created', recipe); // sends the socket event to all current users
			res.redirect('/#!/recipes/'+recipe._id);
		}
	});
};

/**
 * Show the current Recipe
 *
 * 1 updating the recipes view everytime this is called, then
 * 2 resaving to the model.
 */
exports.read = function(req, res) {

	//	1. increment views

	// res.jsonp(req.recipe);
	var recipe = req.recipe;
	console.log(recipe);
	recipe.views += 1;

	// 	2.	save updated views count back mongodb
	recipe.save(function(err) {
		if (err) 
		{
			console.log('issue in recipes/server/cntrl/read-function-save, ln70: ' + err);

			return res.status(400).send({
				message: 	errorHandler.getErrorMessage(err)
			});

		} else {

			// if we get here then there was not an issue 
			// saving back to mongodb.
			res.jsonp(recipe);	// send this data to our view in public
		}
	});
};

/**
 * Update a Recipe
 */
exports.update = function(req, res) {

	// grab data from form in view
	var recipe = req.recipe;

	recipe = _.extend(recipe , req.body);

	recipe.save(function(err) {
		if (err) {
			console.log('Update photo issue');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Updated a photo successful');
			res.jsonp(recipe);
		}
	});
};



/*

likes a recipe


1. check is authorized user

ss2. seems to be checking or looping through an 
array each recipe will have to see if that users_id, 
currently authorized user that is, has already liked this
photo or not.

 */
exports.like = function(req, res) {

	// authenorized user is true.
	var user = req.user;
	var containsValue = false;


	// determine if user is
	// already in
	for (var i = 0; i < req.recipe.likes.length; i++) {

		// console.log('comparing ' + req.recipe.likes[i]) + ' to ' + req.user._id + ' is ' + req.recipe.likes[i].equals(req.user._id));
	    console.log('Comparing ' + req.photo.likes[i] + ' to ' + req.user._id + ' is ' + req.photo.likes[i].equals(req.user._id));
		
		if (req.recipe.likes[i].equals(req.user._id)) {	
			// this part says if the user
			// is authorized then we can 
			// click like to increment the value/?
			containsValue = true;
		}

	}


	// if not value, 
	if(!containsValue) {
		console.log('user: ' , user , ' has liked photo');
		req.recipe.likes.push(req.user._id);
	}

	// save out
	req.recipe.save(function(err) {
		if (err) {
			console.log('error: servers/recipe/ctrllr/like-function. ln160.' , err);
			// return error message
			return res.status(400).send({
				message: 	errorHandler.getErrorMessage(err)
			});
		} else {
			// else, return recipe 
			res.jsonp(req.recipe);
		}
	});
};



/**
 * Delete an Recipe
 */
exports.delete = function(req, res) {
	var recipe = req.recipe ;

	recipe.remove(function(err) {
		if (err) {
			console.log('Delete fail');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Delete successful');
			res.jsonp(recipe);
		}
	});
};

/**
 * List of Recipes
 */
exports.list = function(req, res) { 
	Recipe.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
		if (err) {
			console.log('List error.');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('List successful.');
			res.jsonp(recipes);
		}
	});
};



/**
 * Recipe middleware
 *
 */
exports.recipeByID = function(req, res, next, id) { 
	console.log('finding an id ' + id);

	Recipe.findById(id).populate('user', 'displayName').exec(function(err, recipe) {
		if (err) return next(err);
		if (! recipe) return next(new Error('Failed to load Recipe ' + id));
		req.recipe = recipe;
		next();
	});
};

/**
 * Recipe authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.recipe.user.id !== req.user.id) {
		console.log('user not authorized.');
		return res.status(403).send('User is not authorized');
	}
	next();
};
