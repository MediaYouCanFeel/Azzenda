'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Finance Schema
 */
var FinanceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Finance name',
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

mongoose.model('Finance', FinanceSchema);