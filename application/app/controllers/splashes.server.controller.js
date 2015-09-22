'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Splash = mongoose.model('Splash'),
	_ = require('lodash');

/**
 * Create a Splash
 */
exports.create = function(req, res) {
	var splash = new Splash(req.body);
	splash.user = req.user;

	splash.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(splash);
		}
	});
};

/**
 * Show the current Splash
 */
exports.read = function(req, res) {
	res.jsonp(req.splash);
};

/**
 * Update a Splash
 */
exports.update = function(req, res) {
	var splash = req.splash ;

	splash = _.extend(splash , req.body);

	splash.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(splash);
		}
	});
};

/**
 * Delete an Splash
 */
exports.delete = function(req, res) {
	var splash = req.splash ;

	splash.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(splash);
		}
	});
};

/**
 * List of Splashes
 */
exports.list = function(req, res) { 
	Splash.find().sort('-created').populate('user', 'displayName').exec(function(err, splashes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(splashes);
		}
	});
};

/**
 * Splash middleware
 */
exports.splashByID = function(req, res, next, id) { 
	Splash.findById(id).populate('user', 'displayName').exec(function(err, splash) {
		if (err) return next(err);
		if (! splash) return next(new Error('Failed to load Splash ' + id));
		req.splash = splash ;
		next();
	});
};

/**
 * Splash authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.splash.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
