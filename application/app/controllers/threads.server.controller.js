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
	exports.popThreads([req.thread], function() {
		res.jsonp(req.thread);
	});
};


/**
 * Vote on a Thread
 */
exports.vote = function(req, res) {
	var thread = req.thread;
	var upvote = req.body.upvote;
	
	var upvoteIndex = thread.votes.up.indexOf(req.user._id);
	var downvoteIndex = thread.votes.down.indexOf(req.user._id);
	if(upvoteIndex != -1) {
		thread.votes.up.splice(upvoteIndex, 1);
	} else if(Boolean(upvote)) {
		thread.votes.up.push(req.user);
	} 
	if(downvoteIndex != -1) {
		thread.votes.down.splice(downvoteIndex, 1);
	} else if(!Boolean(upvote)) {
		thread.votes.down.push(req.user);
	}

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

/**
 * Update a Thread
 */
exports.update = function(req, res) {
	var thread = req.thread;
	
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
	Thread.find({'path': {$in: rootIds}}).populate('owner', 'displayName profpic').lean().exec(function(err, threads) {
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
	var threadRequest = Thread.findById(id);
	if(req.originalMethod != 'PUT') {
		threadRequest = threadRequest.populate('owner', 'displayName profpic').populate('votes.up', 'displayName profpic').populate('votes.down', 'displayName profpic');
	}
	threadRequest.lean(req.originalMethod == 'GET').exec(function(err, thread) {
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
	if(req.thread.owner._id === req.user._id) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};