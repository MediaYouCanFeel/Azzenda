'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Task name',
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
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
    messageThreads: [{
    	type: Schema.ObjectId,
    	ref: 'MessageThread'
    }]
});

TaskSchema.methods.getUsersForMessage = function() {
	return this.users;
};

mongoose.model('Task', TaskSchema);