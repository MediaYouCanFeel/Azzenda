'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Skill = mongoose.model('Skill'),
	_ = require('lodash');

/**
 * Create a Skill
 */
exports.create = function(req, res) {
	var skill = new Skill(req.body);
	skill.user = req.user;

	skill.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skill);
		}
	});
};

/**
 * Show the current Skill
 */
exports.read = function(req, res) {
	res.jsonp(req.skill);
};

/**
 * Update a Skill
 */
exports.update = function(req, res) {
	var skill = req.skill ;

	skill = _.extend(skill , req.body);

	skill.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skill);
		}
	});
};

/**
 * Delete an Skill
 */
exports.delete = function(req, res) {
	var skill = req.skill ;

	skill.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skill);
		}
	});
};

/**
 * List of Skills
 */
exports.list = function(req, res) { 
	Skill.find().sort('-created').populate('owner', 'displayName').exec(function(err, skills) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(skills);
		}
	});
};

/**
 * Skill middleware
 */
exports.skillByID = function(req, res, next, id) { 
	Skill.findById(id).populate('user', 'displayName').exec(function(err, skill) {
		if (err) return next(err);
		if (! skill) return next(new Error('Failed to load Skill ' + id));
		req.skill = skill ;
		next();
	});
};

/**
 * Skill authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.skill.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
