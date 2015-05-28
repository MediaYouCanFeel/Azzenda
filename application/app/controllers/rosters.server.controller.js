'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Roster = mongoose.model('Roster'),
	_ = require('lodash');

/**
 * Create a Roster
 */
exports.create = function(req, res) {
	var roster = new Roster(req.body);
	roster.user = req.user;

	roster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roster);
		}
	});
};

/**
 * Show the current Roster
 */
exports.read = function(req, res) {
	res.jsonp(req.roster);
};

/**
 * Update a Roster
 */
exports.update = function(req, res) {
	var roster = req.roster ;

	roster = _.extend(roster , req.body);

	roster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roster);
		}
	});
};

/**
 * Delete an Roster
 */
exports.delete = function(req, res) {
	var roster = req.roster ;

	roster.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roster);
		}
	});
};

/**
 * List of Rosters
 */
exports.list = function(req, res) { 
	Roster.find().sort('-created').populate('user', 'displayName').exec(function(err, rosters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rosters);
		}
	});
};

/**
 * Roster middleware
 */
exports.rosterByID = function(req, res, next, id) { 
	Roster.findById(id).populate('user', 'displayName').exec(function(err, roster) {
		if (err) return next(err);
		if (! roster) return next(new Error('Failed to load Roster ' + id));
		req.roster = roster ;
		next();
	});
};

/**
 * Roster authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.roster.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
