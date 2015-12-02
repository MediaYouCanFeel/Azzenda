'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Thread Schema
 */
var ThreadSchema = new Schema({
	text: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	path: [{
		type: Schema.ObjectId,
		ref: 'Thread'
	}],
	votes: {
		up: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
		down: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
	},
    archived: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Thread', ThreadSchema);