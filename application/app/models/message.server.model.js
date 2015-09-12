'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageThreadSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	messages: [{
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
	}],
	notification: {
		type: Boolean,
		default: false
	}
});

MessageThreadSchema.virtual('lastUpdate').get(function() {
	return this.messages[this.messages.length-1].sent;
});

mongoose.model('MessageThread', MessageThreadSchema);