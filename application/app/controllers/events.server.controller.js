'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Event'),
	_ = require('lodash');

/**
 * Create an Event
 */
exports.create = function(req, res) {
	var event = new Event(req.body);
	event.user = req.user;
    //event.guests = {"user": req.user,"status": 'Attending'};
    for(var dt in event.requestedDateTimeRange.dateTime) {
        for(var param in dt.parameters) {
            
        }
    }
    
    event.scheduledDateTimeRange.start = event.requestedDateTimeRange.dateTimes[0].start;
    
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
exports.list = function(req, res) {
    var roles = ['admin'];
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().sort('-created').populate('user', 'displayName').populate('project', 'name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(events);
            }
        });
    } else {
        Event.find({$or: [{user: req.user._id},{'guests.user': req.user._id}]}).sort('-created').populate('user', 'displayName').populate('project', 'name').exec(function(err, events) {
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
    Event.distinct('type').exec(function(err, types) {
        res.jsonp(types);
    });
};


/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { 
	Event.findById(id).populate('user', 'displayName').populate('project', 'name').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		req.event = event;
		next();
	});
};

/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.event.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};