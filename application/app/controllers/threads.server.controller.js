'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Thread = mongoose.model('Thread'),
	_ = require('lodash');

/**
 * Create a Thread
 */
exports.create = function(req, res) {
	var parThread = req.body.parThread;
	delete req.body.parThread;
	var thread = new Thread(req.body);
	thread.owner = req.user;
	if(parThread) {
		Thread.findById(parThread).exec(function(err, parentThread) {
			if(err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				thread.path = parentThread.path.concat(parThread);
				thread.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(thread);
					}
				});
			}
		});
	} else {
		thread.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(thread);
			}
		});
	}
};

/**
 * Show the current Thread
 */
exports.read = function(req, res) {
	exports.popThreads([req.thread], function(threads) {
		res.jsonp(threads[0]);
	});
};

/**
 * Update a Thread
 */
exports.update = function(req, res) {
	var thread = req.thread ;

	thread = _.extend(thread , req.body);

	thread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thread);
		}
	});
};

/**
 * Delete a Thread
 */
exports.delete = function(req, res) {
	var thread = req.thread ;

	thread.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thread);
		}
	});
};

/**
 * fully populate a Thread
 */
exports.popThreads = function(rootThreads, callback) {
	var rootIds = rootThreads.map(function(a) {
		return a._id;
	});
	Thread.find({'path': {$in: rootIds}}).lean().exec(function(err, threads) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			threads = threads.sort(function(a, b) {
				return a.path.length - b.path.length;
			});
			var map = {};
			rootThreads.forEach(function(rootThread) {
				rootThread.subThreads = [];
				map[rootThread._id] = rootThread;
			});
			threads.forEach(function(thread) {
				map[thread._id] = thread;
				thread.subThreads = [];
				map[thread.path[thread.path.length-1]].subThreads.push(thread);
			});
			callback();
		}
	});
}

/**
 * List of Threads
 */
exports.list = function(req, res) { 
	Thread.find().exec(function(err, threads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(threads);
		}
	});
};

/**
 * Thread middleware
 */
exports.threadByID = function(req, res, next, id) { 
	Thread.findById(id).populate('owner', 'displayName').lean(req.originalMethod == 'GET').exec(function(err, thread) {
		if (err) return next(err);
		if (! thread) return next(new Error('Failed to load Thread ' + id));
		req.thread = thread;
		next();
	});
};

/**
 * Thread authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	if(req.thread.owner.id === req.user.id) {
		next();
		//return;
//	}
//	return res.status(403).send('User is not authorized');
};