'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Finance = mongoose.model('Finance'),
	_ = require('lodash');

/**
 * Create a Finance
 */
exports.create = function(req, res) {
	var finance = new Finance(req.body);
	finance.user = req.user;

	finance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(finance);
		}
	});
};

/**
 * Show the current Finance
 */
exports.read = function(req, res) {
	res.jsonp(req.finance);
};

/**
 * Update a Finance
 */
exports.update = function(req, res) {
	var finance = req.finance ;

	finance = _.extend(finance , req.body);

	finance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(finance);
		}
	});
};

/**
 * Delete an Finance
 */
exports.delete = function(req, res) {
	var finance = req.finance ;

	finance.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(finance);
		}
	});
};

/**
 * List of Finances
 */
exports.list = function(req, res) { 
	Finance.find().sort('-created').populate('user', 'displayName').exec(function(err, finances) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(finances);
		}
	});
};

/**
 * Finance middleware
 */
exports.financeByID = function(req, res, next, id) { 
	Finance.findById(id).populate('user', 'displayName').exec(function(err, finance) {
		if (err) return next(err);
		if (! finance) return next(new Error('Failed to load Finance ' + id));
		req.finance = finance ;
		next();
	});
};

/**
 * Finance authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.finance.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
