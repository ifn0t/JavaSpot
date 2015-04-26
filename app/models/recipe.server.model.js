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
	espressoShots: {
		type: Number,
		default: 1,
		min: 1,
		max: 4
	},
	decaf: {
		type: Boolean,
		default: false
	},
	syrup: {
		type: String,
		default: ''
	},
	dairy: {
		type: String,
		default: ''
	},
	sugar: {
		type: Number,
		default: 0,
		min: 0,
		max: 4
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