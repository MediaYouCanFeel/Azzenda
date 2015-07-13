'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
    ObjectId = require('mongoose').Types.ObjectId,
	User = mongoose.model('User'),
	_ = require('lodash');

exports.createUser = function(req, res) {
    //req.body.username = req.body.email;
    
    // Init Variables
	var user = new User(req.body);
    //var creator = req.user;
            
    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    //user.username = user.email;

    // Then save the user 
    user.save(function(err) {
        if (err) {
            var msg = errorHandler.getErrorMessage(err);
            msg = msg.replace(/username/g, "email");
            msg = msg.replace(/Username/g, "Email");
            return res.status(400).send({
                message: msg
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    });
};

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
    User.aggregate([{$project: {firstName: 1, lastName: 1, displayName: 1, email: '$username', roles: 1, updated: 1, created: 1, groups: 1}}],function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
    /*
	User.find({},{password: false, salt: false, providerData: false}).sort('-created').aggregate({$project: {email: "$username", document: "$$ROOT"}}).exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            
			res.jsonp(users);
		}
	});*/
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
    User.aggregate([{$match: {_id: ObjectId(id)}},{$project: {firstName: 1, lastName: 1, displayName: 1, email: '$username', roles: 1, updated: 1, created: 1, groups: 1}}],function(err, users) {
        console.log(users.length);
        var user = users[0];
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load User ' + id));
        req.otherUser = user;
        next();
    });
    /*
	User.findById(id).exec(function(err, user) {
		if (err) return next(err);
		if (! user) return next(new Error('Failed to load User ' + id));
        user.password = undefined;
        user.salt = undefined;
        user.providerData = undefined;
        user.email = user.email;
		req.otherUser = user;
		next();
	});*/
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