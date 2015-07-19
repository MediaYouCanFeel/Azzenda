'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please fill Message content',
		trim: true
	},
	sent: {
		type: Date,
		default: Date.now
	},
	from: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Message', MessageSchema);