'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Event'),
    moment = require('moment'),
    MongoPromise = require('mongoose').Types.Promise,
	_ = require('lodash');
require('twix');



/**
 * Create an Event
 */
exports.create = function(req, res) {
	if(req.body.personal) {
		req.body.status = 'personal';
		delete req.body.personal;
		delete req.body.type;
		delete req.body.location;
		delete req.body.proj;
		delete req.body.desc;
		var event = new Event(req.body);
		event.owner = req.user;
		
		event.recurring.markModified('params');
		
		if(event.recurring.type == 'NONE') {
			event.sched.end = event.sched.start.getTime() + event.length;
		}
		
		var events = event.recurUnrollNext(event.sched.start, event.sched.end);
		
		var eventOb = event.toObject();
		delete eventOb._id;
		console.log(eventOb);
		
		var i;
		for(i=1; i<events.length; i++) {
			var evnt = new Event(eventOb);
			evnt.sched.start = events[i].sched.start;
			evnt.sched.end = events[i].sched.end;
			evnt.save(function(err) {
				if(err) {
	            	console.log('Event save error');
	            	var errMsg = errorHandler.getErrorMessage(err);
	            	if(errMsg == '') {
	            		errMsg = err.message;
	            		if(errMsg == '') {
	            			errMsg = err;
	            		}
	            	}
	            	console.log(errMsg);
	                return res.status(400).send({
	                    message: errMsg
	                });
	            }
			});
		}
		
		event.sched.start = events[0].sched.start;
		event.sched.end = events[0].sched.end;
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
            	console.log(errMsg);
                return res.status(400).send({
                    message: errMsg
                });
            } else {
                return res.jsonp(event);
            }
        });
	} else if(req.body.recurring.type != 'NONE'){
		delete req.body.personal;
		var event = new Event(req.body);
		event.owner = req.user;
		
		event.recurring.markModified('params');
		
		var reqGuests = req.body.reqGuests || [];
	    delete req.body.reqGuests;
	    var opGuests = req.body.opGuests || [];
	    delete req.body.opGuests;
		
		var j;
		for(j=0; j<reqGuests.length; j++) {
			var curGuest = reqGuests[j];
			event.guests.push({
				user: curGuest,
				status: 'invited',
				required: true
			});
		}
		
		for(j=0; j<opGuests.length; j++) {
			var curGuest = opGuests[j];
			event.guests.push({
				user: curGuest,
				status: 'invited',
				required: false
			});
		}
		
		var events = event.recurUnrollNext(event.sched.start, event.sched.end);
		
		var eventOb = event.toObject();
		delete eventOb._id;
		console.log(eventOb);
		
		var i;
		for(i=1; i<events.length; i++) {
			var evnt = new Event(eventOb);
			evnt.sched.start = events[i].sched.start;
			evnt.sched.end = events[i].sched.end;
			evnt.save(function(err) {
				if(err) {
	            	console.log('Event save error');
	            	var errMsg = errorHandler.getErrorMessage(err);
	            	if(errMsg == '') {
	            		errMsg = err.message;
	            		if(errMsg == '') {
	            			errMsg = err;
	            		}
	            	}
	            	console.log(errMsg);
	                return res.status(400).send({
	                    message: errMsg
	                });
	            }
			});
		}
		
		event.sched.start = events[0].sched.start;
		event.sched.end = events[0].sched.end;
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
            	console.log(errMsg);
                return res.status(400).send({
                    message: errMsg
                });
            } else {
                return res.jsonp(event);
            }
        });
	} else {
		delete req.body.personal;
	    var reqGuests = req.body.reqGuests || [];
	    var opGuests = req.body.opGuests || [];
	    delete req.body.reqGuests;
	    delete req.body.opGuests;
	    var schedStart = req.body.sched.start;
	    var schedEnd = req.body.sched.end;
	    delete req.body.sched.start;
	    delete req.body.sched.end;
		var event = new Event(req.body);
		event.owner = req.user;
		
		var j;
		for(j=0; j<reqGuests.length; j++) {
			var curGuest = reqGuests[j];
			event.guests.push({
				user: curGuest,
				status: 'invited',
				required: true
			});
		}
		
		for(j=0; j<opGuests.length; j++) {
			var curGuest = opGuests[j];
			event.guests.push({
				user: curGuest,
				status: 'invited',
				required: false
			});
		}
		
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
            	req.event = event;
            	req.body.schedStart = schedStart;
            	req.body.schedEnd = schedEnd;
                exports.schedule(req, res);
            }
		});
	}
};

exports.schedule = function(req, res) {
	var event = req.event;
	//getting the list of required guests
	var guests = event.guests.filter(function(guest) {
		return guest.required;
	}).map(function(guest){
		return guest.user;
	});
	
	console.log(moment(req.body.schedStart)._d);
	console.log(moment(req.body.schedEnd)._d);
	
	//Make these parameters that can be passed by the front-end
	var currDate = moment(req.body.schedStart || moment().add(1, 'h'));
	var lasttDate = moment(req.body.schedEnd || moment().add(30, 'd'));
	
	event.possDates = {
			start: parseInt(currDate.format('x')),
			end: parseInt(lasttDate.format('x'))
	};
	
	var i;
	for(i=0; i<event.filters.length; i++) {
		event.filters[i].markModified('params');
		event.possFilter(event.filters[i]);
	}
	
	event.possDates = event.possDates.sort(function(a,b) {
		return a.start.getTime() - b.start.getTime();
	});
	
	Event.find({$and: [{$or: [{$and: [{status: 'personal'},{owner: {$in: guests}}]},{$and: [{'guests.user': {$in: guests}},{'guests.status': {$in: ['invited','going']}}]}]},{priority: {$gte: event.priority}}]}).where('sched.end').gt(new Date()).sort('sched.start').exec(function(err,userEvents) {
		if(err) {
			console.log('Personal Event Error');
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
			var oldPossibleDates = event.possDates;
			var i;
			var l=0;
			for(i=0; i<oldPossibleDates.length && l<userEvents.length;) {
				var userDateRange = moment(userEvents[l].sched.start).subtract(15, 'minutes').twix(moment(userEvents[l].sched.end).add(15, 'minutes'));
				var oldDateRange = moment(oldPossibleDates[i].start).twix(oldPossibleDates[i].end);
				if(userDateRange.overlaps(oldDateRange) || userDateRange.engulfs(oldDateRange) || oldDateRange.engulfs(userDateRange) || oldDateRange.overlaps(userDateRange)) {
					var newDateRange = oldDateRange.difference(userDateRange);
					var tempI = i;
					oldPossibleDates.splice(tempI,1);
					newDateRange.forEach(function(dateRange) {
						oldPossibleDates.splice(tempI++, 0, {
							start: new Date(parseInt(dateRange.start().format('x'))),
							end: new Date(parseInt(dateRange.end().format('x'))),
						});
					});
				} else {
					if(userDateRange.start().isBefore(oldDateRange.start())) {
						l++;
					} else {
						i++;
					}
				}
			}
			event.possDates = oldPossibleDates;
			
			event.possDates = event.possDates.sort(function(a,b) {
				return a.start.getTime() - b.start.getTime();
			});
			
			event.status = 'unschedulable';	
			for(i=0; i<event.possDates.length; i++) {
				var posDate = event.possDates[i];
				if((posDate.end.getTime() - posDate.start.getTime()) >= event.length) {
					event.sched.start = posDate.start;
					event.sched.end = posDate.start.getTime() + event.length;
					event.status = 'scheduled';
					break;
				}
			}
			            	
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

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	req.event.populate('guests.user', 'displayName profpic');
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
    var currDate = moment(req.query.startDate);
    var lastDate = moment(parseInt(req.query.endDate));
    console.log(lastDate._d);
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().where('sched.end').gt(currDate).where('sched.start').lt(lastDate).populate('owner', 'displayName profpic').populate('proj', 'name').populate('guests.user', 'displayName profpic').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
//            	var i;
//            	for(i=0; i<events.length;) {
//            		var curEvent = events[i];
//            		
//        			var unrolled = curEvent.recurUnrollNext(currDate,lastDate);
//        			events.splice(i, 1);
//        			if(unrolled) {
//        				var j;
//            			for(j=0; j<unrolled.length; j++) {
//            				events.splice(i++, 0, unrolled[j]);
//            			}
//        			}
//            	}
                res.jsonp(events);
            }
        });
    } else {
        Event.find({$or: [{'owner': req.user._id},{'guests.user': req.user._id}]}).where('sched.end').gt(currDate).where('sched.start').lt(lastDate).sort('-created').populate('owner', 'displayName profpic').populate('proj', 'name').populate('guests.user','displayName profpic').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
//            	var i;
//            	for(i=0; i<events.length; i++) {
//            		var curEvent = events[i];
//            		if(curEvent.status == 'personal') {
//            			var unrolled = curEvent.recurUnrollNext(currDate,lastDate);
//            			events.splice(i, 1);
//            			if(unrolled) {
//            				var j;
//                			for(j=0; j<unrolled.length; j++) {
//                				events.splice(i, 0, unrolled[j]);
//                				i++;
//                			}
//            			}
//            		}
//            	}
                res.jsonp(events);
            }
        });
    }
};

/**
 * Get list of event types
 */
exports.listTypes = function(req, res) {
	Event.find({$and: [{status: {$ne: 'personal'}},{type: {$ne: ''}}]}).distinct('type').exec(function(err, types) {
    	if(err) {
    		return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
    	} else {
    		res.jsonp(types);
    	}
    });
};

/**
 * Get list of event locations
 */
exports.listLocations = function(req, res) {
	Event.find({$and: [{status: {$ne: 'personal'}},{location: {$ne: ''}}]}).distinct('location').exec(function(err, locs) {
    	if(err) {
    		return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
    	} else {
    		res.jsonp(locs);
    	}
    });
};

/**
 * RSVP to an event
 */
exports.rsvp = function(req, res) {
    var event = req.event;
    var user = req.user;
    var going = req.body.going;
    
    var guestIndex = _.findIndex(event.guests, {'user': user._id});
    if(going) {
    	event.guests[guestIndex].status = 'going';
    } else {
    	event.guests[guestIndex].status = 'not going';
    }
    
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
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { 
	Event.findById(id).populate('owner', 'displayName').populate('proj', 'name').exec(function(err, event) {
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
	var roles = ['admin']
	if ((req.event.owner.id.equals(req.user.id)) || _.intersection(req.user.roles,roles).length) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};