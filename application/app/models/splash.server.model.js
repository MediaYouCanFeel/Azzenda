'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Splash Schema
 */
var SplashSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Splash name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Splash', SplashSchema);