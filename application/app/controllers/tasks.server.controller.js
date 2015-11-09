'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Task'),
	_ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
	var parTask = req.body.parTask;
	delete req.body.parTask;
	if(req.body.owners.users) {
		for(var i=0; i<req.body.owners.users.length; i++) {
			req.body.owners.users[i] = {
					user: req.body.owners.users[i]
			}
		}
	}
	if(req.body.workers.users) {
		for(var i=0; i<req.body.workers.users.length; i++) {
			req.body.workers.users[i] = {
					user: req.body.workers.users[i]
			}
		}
	}
	var task = new Task(req.body);
	if(parTask) {
		Task.findById(parTask).exec(function(err, parentTask) {
			if(err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				task.path = parentTask.path.concat(parTask);
				task.project = parentTask.project;
				task.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(task);
					}
				});
			}
		});
	} else {
		task.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(task);
			}
		});
	}
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
	res.jsonp(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
	var task = req.task ;

	task = _.extend(task , req.body);

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
	var task = req.task ;

	task.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * List of Tasks
 */
exports.list = function(req, res) { 
	Task.find().sort('-created').populate('owners.users', 'displayName').populate('owner.team').populate('workers.users', 'displayName').populate('workers.team').populate('path').populate('project').exec(function(err, tasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tasks);
		}
	});
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
	var reading = (req.originalMethod == 'GET');
	Task.findById(id).populate('owners.users.user', 'displayName').populate('owners.team').populate('workers.users.user', 'displayName').populate('workers.team').populate('path').populate('project').lean(reading).exec(function(err, task) {
		if (err) return next(err);
		if (! task) return next(new Error('Failed to load Task ' + id));
		if(reading) {
			Task.find({$and: [{'path' : id},{'path' : {$size: task.path.length+1}}]}).exec(function(err,tasks) {
				if(err) return next(err);
				task.subTasks = tasks;
				req.task = task;
				next();
			});
		} else {
			req.task = task;
			next();
		}
	});
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	if (req.task.user.id !== req.user.id) {
//		return res.status(403).send('User is not authorized');
//	}
	next();
};
