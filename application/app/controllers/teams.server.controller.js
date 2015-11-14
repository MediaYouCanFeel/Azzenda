'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	Task = mongoose.model('Task'),
	TaskCtrl = require('../../app/controllers/tasks.server.controller'),
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
	Task.find({'owners.team' : req.team._id}).populate('owners.users.user', 'displayName').populate('owner.team').populate('workers.users.user', 'displayName').populate('workers.team').lean().exec(function(err, ownerTasks) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Task.find({'workers.team' : req.team._id}).populate('owners.users.user', 'displayName').populate('owner.team').populate('workers.users.user', 'displayName').populate('workers.team').lean().exec(function(err, workerTasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					var combinedTasks = ownerTasks.concat(workerTasks);
					TaskCtrl.popTasks.call(this,combinedTasks,function() {
						req.team.workerTasks = workerTasks;
						req.team.ownerTasks = ownerTasks;
						res.jsonp(req.team);
					});
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
	Team.find().populate('owners', 'displayName').populate('users', 'displayName').populate('project').lean().exec(function(err, teams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var teamIds = teams.map(function(team) {
				return team._id;
			})
			Task.aggregate([{$match: {'owners.team': {$in: teamIds}}},{$group: {_id: '$owners.team', tasks: {$push: '$$ROOT'}}}]).sort('_id').exec(function(err, ownerTasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					Task.aggregate([{$match: {'workers.team': {$in: teamIds}}},{$group: {_id: '$workers.team', tasks: {$push: '$$ROOT'}}}]).sort('_id').exec(function(err, workerTasks) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							console.log(workerTasks);
							console.log(ownerTasks);
							for(var i=0, j=0, k=0; i<teams.length; i++) {
								if(j >= ownerTasks.length) {
									teams[i].ownerTasks = [];
								} else if(teams[i]._id.equals(ownerTasks[j]._id)) {
									teams[i].ownerTasks = ownerTasks[j++].tasks;
								} else {
									teams[i].ownerTasks = [];
								}
								
								if(k >= workerTasks.length) {
									teams[i].workerTasks = [];
								} else if(teams[i]._id.equals(workerTasks[k]._id)) {
									teams[i].workerTasks = ownerTasks[k++].tasks;
								} else {
									teams[i].workerTasks = [];
								}
							}
							res.jsonp(teams);
						}
					});
				}
			});
		}
	});
};

/**
 * Team middleware
 */
exports.teamByID = function(req, res, next, id) { 
	Team.findById(id).populate('owners', 'displayName profpic').populate('users', 'displayName profpic').populate('project').lean(req.originalMethod == 'GET').exec(function(err, team) {
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
