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
	//pass back
	//text
	//path
	//parThread = _id
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
	res.jsonp(req.thread);
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
 * populate Thread
 */
var popThread = function(parThread, threads) {
	childArray = [];
	for(var thread in threads) {
		if(thread.path[thread.path.length-1] == parThread._id) {
			childArray.push(exports.popThread(thread, threads));
		}
	}
	return {
		thread: parThread,
		children: childArray
	};
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
	Thread.findById(id).populate('owner', 'displayName').exec(function(err, thread) {
		if (err) return next(err);
		if (! thread) return next(new Error('Failed to load Thread ' + id));
		Thread.find({'path': id}).populate('owner', 'displayName').sort('created').exec(function(err, threads) {
			if(err) {
				return next(err);
			}
			req.thread = popThread(thread, threads);
			next();
		});
	});
};

/**
 * Thread authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	if(req.thread.owner.id === req.user.id) {
		next();
		return;
//	}
//	return res.status(403).send('User is not authorized');
};