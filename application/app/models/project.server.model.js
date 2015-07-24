'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
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
    description: {
        type: String,
        default: '',
        required: 'Please enter a description of the project',
        trim: true
    },
    type: {
        type: String,
        required: 'Please select an existing type or create a new one',
        trim: true
    },
    status: {
        type: String,
        trim: true,
        enum: ['Not Started', 'In Progress', 'Completed']
    },
    users: [{
    	type: Schema.ObjectId,
    	ref: 'User'
    }],
    messageThreads: [{
    	type: Schema.ObjectId,
    	ref: 'MessageThread'
    }],
    archived: {
        type: Boolean,
        default: false
    }
});

ProjectSchema.methods.getUsersForMessage = function() {
	return this.users;
};

mongoose.model('Project', ProjectSchema);