'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	Thread = mongoose.model('Thread'),
	Team = mongoose.model('Team'),
	Task = mongoose.model('Task'),
	TaskCtrl = require('../../app/controllers/tasks.server.controller'),
	ThreadCtrl = require('../../app/controllers/threads.server.controller'),
	_ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	Team.find({'project' : req.project._id}).populate('owners', 'displayName profpic').populate('users', 'displayName profpic').exec(function(err, teams) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Task.find({$and: [{'project' : req.project._id},{'path': {$size: 0}}]}).populate('owners.users.user', 'displayName profpic').populate('owners.team', 'name').populate('workers.users.user','displayName profpic').populate('workers.team','name').lean().exec(function(err, tasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					Thread.find({_id: {$in: req.project.threads}}).populate('owner', 'displayName profpic').populate('votes.up', 'displayName profpic').populate('votes.down', 'displayName profpic').lean().exec(function(err, threds) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							req.project.teams = teams;
							TaskCtrl.popTasks.call(this,tasks,function() {
								req.project.tasks = tasks;
								ThreadCtrl.popThreads.call(this,threds,function() {
									req.project.threads = threds;
									res.jsonp(req.project);
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
 * Update a Project
 */
exports.addThread = function(req, res) {
	var project = req.project ;
	var thread = req.body.thread;
	delete req.body.thread;
	
	if(thread) {
		project.threads.push(thread);
	}

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project ;

	project = _.extend(project , req.body);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;

	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * List projects
 */
exports.list = function(req, res) {
	Project.find({archived: (req.query.archived || false)}).sort('_id').populate('owners','displayName profpic').populate('users','displayName profpic').lean().exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Team.aggregate([{$group: {_id: '$project', teams: {$push: '$$ROOT'}}}]).sort('_id').exec(function(err, projTeams) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					for(var i=0, j=0; i<projects.length; i++) {
						if(j >= projTeams.length) {
							projects[i].teams = [];
						}
						else if(projects[i]._id.equals(projTeams[j]._id)) {
							projects[i].teams = projTeams[j++].teams;
						} else {
							projects[i].teams = [];
						}
					}
					Task.aggregate([{$match: {'path': {$size: 0}}},{$group: {_id: '$project', tasks: {$push: '$$ROOT'}}}]).sort('_id').exec(function(err, projTasks) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							var allRootTasks = [];
							for(var i=0, j=0; i<projects.length; i++) {
								if(j >= projTasks.length) {
									projects[i].tasks = [];
								} else if(projects[i]._id.equals(projTasks[j]._id)) {
									projects[i].tasks = projTasks[j++].tasks;
									allRootTasks = allRootTasks.concat(projects[i].tasks);
								} else {
									projects[i].tasks = [];
								}
							}
					            TaskCtrl.popTasks.call(this, allRootTasks, function() {
									res.jsonp(projects);
								});
						}
					});
				}
			});
		}
	});
};

exports.listTypes = function(req, res) {
	Project.find().distinct('type').exec(function(err, types) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(types);
		}
	});
}

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id).populate('owners', 'displayName profpic firstName lastName').populate('users', 'displayName profpic firstName lastName').populate('thread').lean(req.originalMethod == 'GET').exec(function(err, project) {
		if (err) return next(err);
		if (! project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var roles = ['admin'];
	if (_.intersection(req.user.roles,roles).length) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};
