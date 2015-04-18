'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var recipes = require('../../app/controllers/recipes.server.controller');
	var multer = require('multer');

	// route multer uploads to this directory
	app.use(multer({ dest:'./public/uploads'}));
	// Recipes Routes
	app.route('/recipes')
		.get(recipes.list)
		.post(users.requiresLogin, recipes.create);

	app.route('/recipes/:recipeId')
		.get(recipes.read)
		.put(users.requiresLogin, recipes.hasAuthorization, recipes.update)
		.delete(users.requiresLogin, recipes.hasAuthorization, recipes.delete);
	// adds a route for likes
	app.route('/photos/like/:photoId')
		.put(users.requiresLogin, recipes.like);

	// Finish by binding the Recipe middleware
	app.param('recipeId', recipes.recipeByID);
};
