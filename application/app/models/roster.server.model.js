'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Roster Schema
 */
var RosterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Roster name',
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

mongoose.model('Roster', RosterSchema);