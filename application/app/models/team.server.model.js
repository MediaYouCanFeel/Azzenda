'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter a team name',
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
	description: {
        type: String,
        default: '',
        trim: true
    },
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	project: {
		type: Schema.ObjectId,
		ref: 'Project',
	},
	topics: [{
		name: {
			type: String,
			default: '',
			required: 'Please enter a thread name',
			trim: true
		},
		description: {
			type: String,
			default: '',
			trim: true
		},
		rootThread: {
			type: Schema.ObjectId,
			ref: 'Thread'
		}
	}],
	gdocs: [{
		type: String
	}],
    archived: {
    	type: Boolean,
    	default: false
    }
});

mongoose.model('Team', TeamSchema);