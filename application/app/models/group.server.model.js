'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter Group name',
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
    }],
    permissions: [{
        type: String
    }]
});

GroupSchema.methods.getUsersForMessage = function() {
	return this.users;
};

mongoose.model('Group', GroupSchema);