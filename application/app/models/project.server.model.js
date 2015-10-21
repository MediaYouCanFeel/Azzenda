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
		required: 'Please enter project name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	owners: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
    description: {
        type: String,
        default: '',
        trim: true
    },
    teams: [{
    	type: Schema.ObjectId,
    	ref: 'Team'
    }],
    users: [{
    	type: Schema.ObjectId,
    	ref: 'User'
    }],
    thread: {
    	type: Schema.ObjectId,
    	ref: 'Thread'
    },
    archived: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Project', ProjectSchema);