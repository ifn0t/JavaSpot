'use strict';

var users = require('../../app/controllers/users.server.controller');
var recipes = require('../../app/controllers/recipes.server.controller');


module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
};