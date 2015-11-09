'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	Task = mongoose.model('Task'),
	_ = require('lodash');

/**
 * Create a Team
 */
exports.create = function(req, res) {
	var team = new Team(req.body);

	team.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Show the current Team
 */
exports.read = function(req, res) {
	Task.find({'owners.team' : req.team._id}).exec(function(err, ownerTasks) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Task.find({'workers.team' : req.team._id}).exec(function(err, workerTasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.team.workerTasks = workerTasks;
					req.team.ownerTasks = ownerTasks;
					res.jsonp(req.team);
				}
			});
		}
	});
};

/**
 * Update a Team
 */
exports.update = function(req, res) {
	var team = req.team ;

	team = _.extend(team , req.body);

	team.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * Delete a Team
 */
exports.delete = function(req, res) {
	var team = req.team ;

	team.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(team);
		}
	});
};

/**
 * List of Teams
 */
exports.list = function(req, res) { 
	Team.find().populate('owners', 'displayName').populate('users', 'displayName').populate('project').populate('topics.rootThread').exec(function(err, teams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teams);
		}
	});
};

/**
 * Team middleware
 */
exports.teamByID = function(req, res, next, id) { 
	Team.findById(id).populate('owners', 'displayName').populate('users', 'displayName').populate('project').populate('topics.rootThread').lean(req.originalMethod == 'GET').exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Team ' + id));
		req.team = team ;
		next();
	});
};

/**
 * Team authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	for(var owner in req.team.owners) {
//		if(owner.id === req.user.id) {
			next();
//			return;
//		}
//	}
//	return res.status(403).send('User is not authorized');
};
