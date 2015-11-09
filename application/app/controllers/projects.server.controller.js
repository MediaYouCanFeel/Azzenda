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
	_ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	//project.owners.push(req.user);
	project.thread = new Thread();
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
	Team.find({'project' : req.project._id}).exec(function(err, teams) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Task.find({'project' : req.project._id}).exec(function(err, tasks) {
				if(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.project.teams = teams;
					req.project.tasks = tasks;
					res.jsonp(req.project);
				}
			});
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
	Project.find({archived: (req.query.archived || false)}).populate('owners','displayName').populate('teams').populate('users','displayName').populate('tasks').populate('thread').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
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
	Project.findById(id).populate('owners', 'displayName').populate('users', 'displayName').populate('thread').lean(req.originalMethod == 'GET').exec(function(err, project) {
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
	//if (req.project.user.id !== req.user.id) {
		//return res.status(403).send('User is not authorized');
	//}
	next();
};
