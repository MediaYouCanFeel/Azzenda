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
		up: {
			type: Number,
			default: 0
		},
		down: {
			type: Number,
			default: 0
		}
	},
    archived: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Thread', ThreadSchema);