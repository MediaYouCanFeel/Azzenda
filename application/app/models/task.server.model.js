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
	owners: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	workers: {
		users: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
		teams: [{
			type: Schema.ObjectId,
			ref: 'Team'
		}]
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	parent: {
		type: Schema.ObjectId,
		ref: 'Task'
	},
	subtasks: [{
		type: Schema.ObjectId,
		ref: 'Task',
	}],
	status: {
		type: String,
		enum: ['in progress','not started','finished']
	},
	deadline: {
		type: Date
	}
});

mongoose.model('Task', TaskSchema);