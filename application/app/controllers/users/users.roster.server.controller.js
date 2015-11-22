'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
    ObjectId = require('mongoose').Types.ObjectId,
	User = mongoose.model('User'),
	Project = mongoose.model('Project'),
	Team = mongoose.model('Team'),
	Task = mongoose.model('Task'),
	Event = mongoose.model('Event'),
	fs = require('fs'),
	_ = require('lodash');

exports.createUser = function(req, res) {
    // Init Variables
	var user = new User(req.body.credentials);
	var file = req.files.file;
            
    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    if(req.body.activeImg == 'true') {
    	console.log('test');
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
};

/**
 * Show the current User
 */
exports.read = function(req, res) {	
	var user = req.otherUser;
	var obId = ObjectId(user._id);
    user.email = user.username;
    user.ownerProjects = [];
    user.memberProjects = [];
    user.ownerTeams = [];
    user.memberTeams = [];
    user.ownerTasks = [];
    user.workerTasks = [];
    Project.aggregate([{$match: {$or: [{'owners': obId},{'users': obId}]}},{$group: {_id: {$setIsSubset: [[obId], '$owners']}, projects: {$push: '$$ROOT'}}}]).exec(function(err, projects) {
    	if (err) {
    		console.log(err);
    		return res.status(400).send({
				  message: err.msg
			});
    	} else {
	    	projects.forEach(function(projectArray) {
	    		if(projectArray._id) {
	    			user.ownerProjects = projectArray.projects;
	    		} else {
	    			user.memberProjects = projectArray.projects;
	    		}
	    	});
	    	Team.aggregate([{$match: {$or: [{'owners': obId},{'users': obId}]}},{$group: {_id: {$setIsSubset: [[obId], '$owners']}, teams: {$push: '$$ROOT'}}}]).exec(function(err, teams) {
	        	if (err) {
	        		console.log(err);
	        		return res.status(400).send({
	    				  message: err.msg
	    			});
	        	} else {
	    	    	teams.forEach(function(teamArray) {
	    	    		if(teamArray._id) {
	    	    			user.ownerTeams = teamArray.teams;
	    	    		} else {
	    	    			user.memberTeams = teamArray.teams;
	    	    		}
	    	    	});
	    	    	Task.aggregate([{$match: {$or: [{'owners.users.user': obId},{'workers.users.user': obId}]}},{$project: {task: '$$ROOT', allUsers: {$setUnion: ['$owners.users','$workers.users']}}},{$unwind: '$allUsers'},{$match: {'allUsers.user': user._id}},{$project: {_id: 0, task: 1, status: '$allUsers.status'}},{$group: {_id: {'isOwner': {$setIsSubset: [[obId], '$task.owners.users.user']}}, tasks: {$push: '$$ROOT'}}}]).exec(function(err, tasks) {
	    	        	if (err) {
	    	        		console.log(err);
	    	        		return res.status(400).send({
	    	    				  message: err.msg
	    	    			});
	    	        	} else {
	    	    	    	tasks.forEach(function(taskArray) {
	    	    	    		if(taskArray._id.isOwner) {
	    	    	    			user.ownerTasks = taskArray.tasks;
	    	    	    		} else {
	    	    	    			user.workerTasks = taskArray.tasks;
	    	    	    		}
	    	    	    	}); 	
	    	    	    	res.jsonp(req.otherUser);
	    	        	}
	    	        });
	        	}
	        });
    	}
    });
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
    User.aggregate([{$project: {firstName: 1, lastName: 1, displayName: 1, email: '$username', roles: 1, updated: 1, created: 1, groups: 1, profpic: 1}},{$sort: {_id: 1}}],function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Project.aggregate([{$project: {name: 1, owners: 1, users: 1, allUsers: {$setUnion: ['$owners','$users']}}},{$unwind: '$allUsers'},{$group: {_id: {userId: '$allUsers', isOwner: {$anyElementTrue: {$map: {'input': '$owners', 'as': 'ownr', 'in': {$eq: ['$allUsers','$$ownr']}}}}}, projects: {$push: '$$ROOT'}}},{$group: {_id: '$_id.userId', projs: {$push: {isOwner: '$_id.isOwner', projectArray: '$projects'}}}},{$sort: {_id: 1}}]).exec(function(err, userProjs) {
		    	if (err) {
		    		console.log(err);
		    		return res.status(400).send({
						  message: err.msg
					});
		    	} else {
		    		Team.aggregate([{$project: {name: 1, owners: 1, users: 1, allUsers: {$setUnion: ['$owners','$users']}}},{$unwind: '$allUsers'},{$group: {_id: {userId: '$allUsers', isOwner: {$anyElementTrue: {$map: {'input': '$owners', 'as': 'ownr', 'in': {$eq: ['$allUsers','$$ownr']}}}}}, teams: {$push: '$$ROOT'}}},{$group: {_id: '$_id.userId', tems: {$push: {isOwner: '$_id.isOwner', teamArray: '$teams'}}}},{$sort: {_id: 1}}]).exec(function(err, userTeams) {
		    			if(err) {
		    				console.log(err);
				    		return res.status(400).send({
								  message: err.msg
							});
		    			} else {
		    				Task.aggregate([{$project: {name: 1, owners: '$owners.users.user', users: '$workers.users', allUsers: {$setUnion: ['$owners.users.user','$workers.users.user']}}},{$unwind: '$allUsers'},{$group: {_id: {userId: '$allUsers', isOwner: {$anyElementTrue: {$map: {'input': '$owners', 'as': 'ownr', 'in': {$eq: ['$allUsers','$$ownr']}}}}}, tasks: {$push: '$$ROOT'}}},{$group: {_id: '$_id.userId', taks: {$push: {isOwner: '$_id.isOwner', taskArray: '$tasks'}}}},{$sort: {_id: 1}}]).exec(function(err, userTasks) {
		    					if(err) {
		    						console.log(err);
						    		return res.status(400).send({
										  message: err.msg
									});
		    					} else {
		    						for(var i=0, j=0, l=0, m=0; i<users.length; i++) {
		    			    			users[i].memberProjects = [];
		    			    			users[i].ownerProjects = [];
		    			    			users[i].memberTeams = [];
		    			    			users[i].ownerTeams = [];
		    			    			users[i].workerTasks = [];
		    			    			users[i].ownerTasks = [];
		    							if((j < userProjs.length) && (users[i]._id.equals(userProjs[j]._id))) {
		    								for(var k=0; k<userProjs[j].projs.length; k++) {
		    									if(userProjs[j].projs[k].isOwner) {
		    										users[i].ownerProjects = userProjs[j].projs[k].projectArray;
		    									} else {
		    										users[i].memberProjects = userProjs[j].projs[k].projectArray;
		    									}
		    								}
		    								j++;
		    							}
		    							if((l < userTeams.length) && (users[i]._id.equals(userTeams[l]._id))) {
		    								for(var k=0; k<userTeams[l].tems.length; k++) {
		    									if(userTeams[l].tems[k].isOwner) {
		    										users[i].ownerTeams = userTeams[l].tems[k].teamArray;
		    									} else {
		    										users[i].memberTeams = userTeams[l].tems[k].teamArray;
		    									}
		    								}
		    								l++;
		    							}
		    							if((m < userTasks.length) && (users[i]._id.equals(userTasks[m]._id))) {
		    								for(var k=0; k<userTasks[m].taks.length; k++) {
		    									if(userTasks[m].taks[k].isOwner) {
		    										users[i].ownerTasks = userTasks[m].taks[k].taskArray;
		    									} else {
		    										users[i].workerTasks = userTasks[m].taks[k].taskArray;
		    									}
		    								}
		    								m++;
		    							}
		    						}
		    			    		res.jsonp(users);
		    					}
		    				});
		    			}
		    		});
		    	}
		    });
		}
	});
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findById(id).lean(req.originalMethod == 'GET').exec(function(err, user) {
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load User ' + id));
        user.password = undefined;
        user.salt = undefined;
        user.providerData = undefined;
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