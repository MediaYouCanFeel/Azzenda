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
        unique: 'test error message',
		trim: true
	},
    archived: {
        type: Boolean,
        default: false
    }
});

mongoose.model('EventType', EventTypeSchema);