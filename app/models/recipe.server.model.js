'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Recipe Schema
 */
var RecipeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Recipe name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	coffeeName: {
		type: String,
		default: '',
		required: 'Please include your coffee name',
		trim: true
	},
	milk: {
		type: Boolean,
		default: false
	},
	sugar: {
		type: Number,
		default: 0,
		min: 0,
		max: 10
	},
	honey: {
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	views: {
		type: Number
	},
	upvotes: {
		type: Number
	}
});

mongoose.model('Recipe', RecipeSchema);