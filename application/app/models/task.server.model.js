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
		required: 'Please enter Task name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	owners: {
		users: [{
			_id: false,
			user: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			status: {
				type: String,
				enum: ['Pending','Rejected','Accepted'],
				default: 'Pending'
			}
		}],
		team: {
			type: Schema.ObjectId,
			ref: 'Team'
		}
	},
	workers: {
		users: [{
			user: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			status: {
				type: String,
				enum: ['Pending','Rejected','Accepted'],
				default: 'Pending'
			}
		}],
		team: {
			type: Schema.ObjectId,
			ref: 'Team'
		}
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	path: [{
		type: Schema.ObjectId,
		ref: 'Task'
	}],
	status: {
		type: String,
		enum: ['in progress','not started','finished','blocked'],
		default: 'not started'
	},
	deadline: {
		type: Date
	},
	threads: [{
		type: Schema.ObjectId,
		ref: 'Thread'
	}],
	log: [{
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		time: Number,
		description: {
			type: String,
			default: '',
			trim: true
		}
	}]
});

mongoose.model('Task', TaskSchema);