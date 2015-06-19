'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a User
 
exports.create = function(req, res) {
	var user = new User(req.body);
	user.user = req.user;

	roster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(user);
		}
	});
};
*/
/**
 * Show the current User
 */
exports.read = function(req, res) {
	res.jsonp(req.otherUser);
};

/**
 * Update a User
 */
exports.update = function(req, res) {
	var user = req.otherUser ;
	user = _.extend(user , req.body);

	roster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * Delete a User
 */
exports.delete = function(req, res) {
	var user = req.otherUser ;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) { 
	User.find({},{password: false, salt: false, providerData: false}).sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) { 
	User.findById(id).populate('user', 'displayName').exec(function(err, user) {
		if (err) return next(err);
		if (! user) return next(new Error('Failed to load User ' + id));
        user.password = undefined;
        user.salt = undefined;
        user.providerData = undefined;
		req.otherUser = user;
		next();
	});
};

/**
 * User authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var roles = ['admin'];
    if(_.intersection(req.user.roles,roles).length) {
		next();
	} else {
        return res.status(403).send('User is not authorized');
    }
};