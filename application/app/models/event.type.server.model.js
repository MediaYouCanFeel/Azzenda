'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * EventType Schema
 */
var EventTypeSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true
	},
    archived: {
        type: Boolean,
        default: false
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('EventType', EventTypeSchema);