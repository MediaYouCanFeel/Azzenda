'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dash = mongoose.model('Dash'),
	_ = require('lodash');

/**
 * Create a Dash
 */
exports.create = function(req, res) {
	var dash = new Dash(req.body);
	dash.user = req.user;

	dash.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dash);
		}
	});
};

/**
 * Show the current Dash
 */
exports.read = function(req, res) {
	res.jsonp(req.dash);
};

/**
 * Update a Dash
 */
exports.update = function(req, res) {
	var dash = req.dash ;

	dash = _.extend(dash , req.body);

	dash.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dash);
		}
	});
};

/**
 * Delete an Dash
 */
exports.delete = function(req, res) {
	var dash = req.dash ;

	dash.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dash);
		}
	});
};

/**
 * List of Dashes
 */
exports.list = function(req, res) { 
	Dash.find().sort('-created').populate('user', 'displayName').exec(function(err, dashes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashes);
		}
	});
};

/**
 * Dash middleware
 */
exports.dashByID = function(req, res, next, id) { 
	Dash.findById(id).populate('user', 'displayName').exec(function(err, dash) {
		if (err) return next(err);
		if (! dash) return next(new Error('Failed to load Dash ' + id));
		req.dash = dash ;
		next();
	});
};

/**
 * Dash authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dash.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
