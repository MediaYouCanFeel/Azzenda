'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
	MessageThread = mongoose.model('MessageThread'),
	_ = require('lodash');

/**
 * Create a Message Thread
 */
exports.create = function(req, res) {
	var message = req.body.message;
	delete req.body.message;
	var recips = req.body.recipients;
	delete req.body.recipients;
	var messageThread = new MessageThread(req.body);
	messageThread.recipients = [req.user];
	message.from = req.user;
	messageThread.messages = [message];

	messageThread.save(function(err, msgThread) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var getAllUsersPromise = new Promise(function(resolve,reject) {
				resolve([]);
			});
			var recip;
			for(recip in recips) {
				getAllUsersPromise = getAllUsersPromise.then(function(usrs) {
					if(recip.recipientType == "User") {
						return usrs.concat([recipien]);
					} else {
						return window[recip.recipientType].findById(recip.recipient).exec().then(function(recipien) {
							recipien.messageThreads.append(msgThread);
							recipien.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								}
							});
							return usrs.concat(recipien.getUsersForMessage());
						});
					}
				});
			}
			getAllUsersPromise.then(function(usrs) {
				msgThread.recipients = usrs;
				msgThread.save(function(err) {
					if(err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
					res.jsonp(messageThread);
				});
			}, function(err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			});
		}
	});
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
	res.jsonp(req.messageThread);
};

/**
 * Update a Message Thread
 */
exports.update = function(req, res) {
	var messageThread = req.messageThread;

	messageThread = _.extend(messageThread, req.body);

	messageThread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageThread);
		}
	});
};

/**
 * Delete a Message Thread
 */
exports.delete = function(req, res) {
	var messageThread = req.messageThread;

	messageThread.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageThread);
		}
	});
};

/**
 * List of Message Threads
 */
exports.list = function(req, res) {
	MessageThread.find({'recipients': req.user._id}).exec(function(err, messageThreads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageThreads);
		}
	});
};

exports.addMessage = function(req, res) {
	var message = {content: req.message};
	message.from = req.user;
	var messageThread = req.messageThread;
	messageThread.messages.append(message);
	
	messageThread.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageThread);
		}
	});
}

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) { 
	MessageThread.findById(id).exec(function(err, messageThread) {
		if (err) return next(err);
		if (! messageThread) return next(new Error('Failed to load Message Thread ' + id));
		req.messageThread = messageThread;
		next();
	});
};

/**
 * Message authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.message.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
