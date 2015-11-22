'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	fs = require('fs'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
  		user = _.extend(user, req.body);
  		user.updated = Date.now();
  		user.displayName = user.firstName + ' ' + user.lastName;
  		
		if(req.files && req.files.file) {
			var file = req.files.file;
			if(req.body.activeImg == 'true') {
			    fs.readFile(file.path, function (err,original_data) {
			    	 if (err) {
			    	      return res.status(400).send({
			    	            message: errorHandler.getErrorMessage(err)
			    	        });
			    	  }  else {
			    		  // save image in db as base64 encoded - this limits the image size
			    		  // to there should be size checks here and in client
				    	  var base64Image = original_data.toString('base64');
				    	  fs.unlink(file.path, function (err) {
				    	      if (err)
				    	      { 
				    	          console.log('failed to delete ' + file.path);
				    	      }
				    	      else{
				    	        console.log('successfully deleted ' + file.path);
				    	      }
				    	  });
				    	  user.profpic = base64Image;
				
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
			    	  }
			    });
		    } else {
		    	user.profpic = '';
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
		    }
		} else {
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
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};