'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


// schema info
// 
// name 	- string
// likes	- array

/**
 * Recipe Schema
 */
var RecipeSchema = new Schema({
	name: {					// recipe name.
		type: String,
		default: '',
		trim: true
	},
	image: {
		type: String,
		default: '',
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	description: 
	{
		type: String,
		default: '',
		trim: true
	},
	honey: {
		type: Boolean,
		default: false
	},
	views: {
		type: Number,
		default: 0
	},
	likes: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});


mongoose.model('Recipe', RecipeSchema);