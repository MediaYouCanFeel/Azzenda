'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Event'),
    EventType = mongoose.model('EventType'),
    Location = mongoose.model('Location'),
    moment = require('moment'),
    MongoPromise = require('mongoose').Types.Promise,
	_ = require('lodash');



/**
 * Create an Event
 */
exports.create = function(req, res) {
    var evType = req.body.type;
    delete req.body.type;
    var evLoc = req.body.location;
    delete req.body.location;
	var event = new Event(req.body);
	event.owner = req.user;
	event.possibleDates = {
			start: parseInt(moment().add(1, 'hour').format('x')),
			end: parseInt(moment().add(7, 'day').add(1, 'hour').format('x')),
			priority: 0
	}
	
	var i;
	for(i=0; i<event.filters.length; i++) {
		event.filters[i].markModified('params');
		event.execute(event.filters[i]);
	}
	
	event.possibleDates = event.possibleDates.sort(function(a,b) {
		var prio = b.priority - a.priority;
		if(prio == 0) {
			return a.start.getTime() - b.start.getTime();
		} else {
			return prio;
		}
	});
	
	event.status = 'unschedulable';	
	for(i=0; i<event.possibleDates.length; i++) {
		var posDate = event.possibleDates[i];
		if((posDate.end.getTime() - posDate.start.getTime()) >= event.length) {
			event.sched.start = posDate.start;
			event.sched.end = posDate.start.getTime() + event.length;
			event.status = 'scheduled';
			break;
		}
	}
	
	EventType.findOneAndUpdate({name: evType},{name: evType},{upsert: true}).exec(function(err,evntType) {
        if(err) {
        	console.log('Event Type Error');
        	var errMsg = errorHandler.getErrorMessage(err);
        	if(errMsg == '') {
        		errMsg = err.message;
        		if(errMsg == '') {
        			errMsg = err;
        		}
        	}
            return res.status(400).send({
                message: errMsg
            });
        } else {
            event.type = evntType;
            
            Location.findOneAndUpdate({name: evLoc},{name: evLoc},{upsert: true}).exec(function(err,locat) {
            	if(err) {
            		console.log('Location Error');
            		var errMsg = errorHandler.getErrorMessage(err);
                	if(errMsg == '') {
                		errMsg = err.message;
                		if(errMsg == '') {
                			errMsg = err;
                		}
                	}
                    return res.status(400).send({
                        message: errMsg
                    });
            	} else {
	            	event.location = locat;
	            	
		            event.save(function(err) {
		                if(err) {
		                	console.log('Event save error');
		                	var errMsg = errorHandler.getErrorMessage(err);
		                	if(errMsg == '') {
		                		errMsg = err.message;
		                		if(errMsg == '') {
		                			errMsg = err;
		                		}
		                	}
		                    return res.status(400).send({
		                        message: errMsg
		                    });
		                } else {
		                    return res.jsonp(event);
		                }
		            });
            	}
            });
        }
    });
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	res.jsonp(req.event);
};

/**
 * Update an Event
 */
exports.update = function(req, res) {
	var event = req.event ;

	event = _.extend(event , req.body);

	event.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
	var event = req.event ;

	event.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * List of Events
 */
exports.listUpcoming = function(req, res) {
    var roles = ['admin'];
    var currDate = new Date();
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().where('sched.start').gt(currDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(events);
            }
        });
    } else {
        Event.find({$or: [{user: req.user._id},{'guests.user': req.user._id}]}).where('sched.start').gt(currDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(events);
            }
        });
    }
};

/**
 * List of Events
 */
exports.listPast = function(req, res) {
	var roles = ['admin'];
    var currDate = Date.now();
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().where('sched.start').lt(currDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(events);
            }
        });
    } else {
        Event.find({$or: [{user: req.user._id},{'guests.user': req.user._id}]}).where('sched.start').lt(currDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(events);
            }
        });
    }
};

/**
 * Get list of event types
 */
exports.getTypes = function(req, res) {
    EventType.find().exec(function(err, types) {
        res.jsonp(types);
    });
};

/**
 * Get list of event locations
 */
exports.getLocations = function(req, res) {
    Location.find().exec(function(err, locs) {
        res.jsonp(locs);
    });
};

/**
 * Save a new event type
 */
exports.addType = function(req, res) {
    var eventType = new EventType(req.body);
	
	eventType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventType);
		}
	});
};

/**
 * Archive an event type
 */
exports.updateType = function(req, res) {
	var eventType = req.eventType;

	eventType = _.extend(eventType, req.body);

	eventType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventType);
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { 
	Event.findById(id).populate('owner', 'displayName').populate('proj', 'name').populate('type','name').populate('location','name').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		req.event = event;
		next();
	});
};

/**
 * Event Type middleware
 */
exports.eventTypeByID = function(req, res, next, id) { 
	EventType.findById(id).populate('owner', 'displayName').exec(function(err, eventType) {
		if (err) return next(err);
		if (! eventType) return next(new Error('Failed to load EventType ' + id));
		req.eventType = eventType;
		next();
	});
};


/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.event.owner.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};