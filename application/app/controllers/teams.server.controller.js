'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	Task = mongoose.model('Task'),
	Thread = mongoose.model('Thread'),
	Project = mongoose.model('Project'),
	TaskCtrl = require('../../app/controllers/tasks.server.controller'),
	ThreadCtrl = require('../../app/controllers/threads.server.controller'),
	_ = require('lodash');

/**
 * Create a Team
 */
exports.create = function(req, res) {
	var team = new Team(req.body);

	Project.findById(team.project).exec(function(err, project) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			project.users = _.union(project.users.map(function(doc) {
				return String(doc);
			}),
			team.users.map(function(doc) {
				return String(doc);
			}),
			team.owners.map(function(doc) {
				return String(doc);
			}));
			team.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					project.save(function(err) {
						if(err) {
							team.remove(function(err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							});
						} else {
							res.jsonp(team);
						}
					});
				}
			});
		}
	});
};

/**
 * Show the current Team
 */
exports.read = function(req, res) {
	Task.find({'owners.team' : req.team._id}).populate('owners.users.user', 'displayName profpic').populate('owners.team', 'name').populate('workers.users.user', 'displayName profpic').populate('workers.team', 'name').lean().exec(function(err, ownerTasks) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Task.find({'workers.team' : req.team._id}).populate('owners.users.user', 'displayName profpic').populate('owners.team', 'name').populate('workers.users.user', 'displayName profpic').populate('workers.team', 'name').lean().exec(function(err, workerTasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					Thread.find({_id: {$in: req.team.threads}}).populate('owner', 'displayName profpic').populate('votes.up', 'displayName profpic').populate('votes.down', 'displayName profpic').lean().exec(function(err, threds) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							var combinedTasks = ownerTasks.concat(workerTasks);
							TaskCtrl.popTasks.call(this,combinedTasks,function() {
								req.team.workerTasks = workerTasks;
								req.team.ownerTasks = ownerTasks;
								ThreadCtrl.popThreads.call(this,threds,function() {
									req.team.threads = threds;
									res.jsonp(req.team);
								});
							});
						}
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
	var thread = req.body.thread;
	delete req.body.thread;

	team = _.extend(team , req.body);
	
	if(thread) {
		team.threads.push(thread);
	}

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
	Team.find().populate('owners', 'displayName profpic firstName lastName').populate('users', 'displayName profpic firstName lastName').populate('project').lean().exec(function(err, teams) {
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
	Team.findById(id).populate('owners', 'displayName profpic firstName lastName').populate('users', 'displayName profpic firstName lastName').populate('project').lean(req.originalMethod == 'GET').exec(function(err, team) {
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
