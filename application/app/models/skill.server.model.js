'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var SkillSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Skill name',
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
	customParams: [{
		name: String,
		type: String
	}],
	users: [{
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		params: {}
	}]
});

mongoose.model('Skill', SkillSchema);