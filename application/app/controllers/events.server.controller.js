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
	} else {
		delete req.body.personal;
	    var guests = req.body.guests;
	    delete req.body.guests;
	    delete req.body.sched.start;
		var event = new Event(req.body);
		event.owner = req.user;
		//Make this a parameter that can be passed by the front-end
		var lasttDate = moment().add(7, 'day').endOf('day');
		var currDate = moment();
		event.possDates = {
				start: parseInt(currDate.format('x')),
				end: parseInt(lasttDate.format('x')),
				priority: 0
		}
		
		var i;
		for(i=0; i<event.filters.length; i++) {
			event.filters[i].markModified('params');
			event.possFilter(event.filters[i]);
		}
		
		event.possDates = event.possDates.sort(function(a,b) {
			return a.start.getTime() - b.start.getTime();
		});
		
		Event.find({$or: [{$and: [{status: 'personal'},{owner: {$in: guests}}]},{$and: [{'guests.user': {$in: guests}},{'guests.status': {$in: ['invited','going']}}]}]}).where('sched.end').gt(new Date()).sort('sched.start').exec(function(err,userEvents) {
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
				var j;
				for(j=0; j<guests.length; j++) {
					var curGuest = guests[j];
					event.guests.push({
						user: curGuest,
						status: 'invited'
					});
					
					var m;
					var curUserEvents = userEvents.slice(0);
					for(m=0; m<curUserEvents.length; m++) {
						var guestCheck = (String(curUserEvents[m].owner) == String(curGuest));
						if(!guestCheck) {
							for(var cGuest in curUserEvents.guests) {
								if(String(cGuest.user) == String(curGuest)) {
									guestCheck = true;
									break;
								}
							}
						}
						if(guestCheck) {
							var curEvent = curUserEvents[m];
							//console.log("CUREVENT:\n" + curEvent);
	            			var unrolled = curEvent.recurUnrollNext(currDate,lasttDate);
	            			curUserEvents.splice(m, 1);
	            			if(unrolled) {
	            				var n;
	                			for(n=0; n<unrolled.length; n++) {
	                				curUserEvents.splice(m++, 0, unrolled[n]);
	                			}
	            			}
						} else {
							curUserEvents.splice(m,1);
							m--;
						}
					}
					//console.log(curUserEvents);
					curUserEvents = curUserEvents.sort(function(a,b) {
						return a.sched.start.getTime() - b.sched.start.getTime();
					});
					
					var oldPossibleDates = event.possDates;
					var i;
					var l=0;
					for(i=0; i<oldPossibleDates.length && l<curUserEvents.length; i++) {
						console.log('possible date loop');
						var startDate = moment(curUserEvents[l].sched.start);
						var endDate = moment(curUserEvents[l].sched.end);
						var dateRangeStart = moment(oldPossibleDates[i].start);
						var dateRangeEnd = moment(oldPossibleDates[i].end);
//						console.log("Start Date");
//						console.log(startDate._d);
//						console.log("End Date");
//						console.log(endDate._d);
//						console.log("Date Range Start");
//						console.log(dateRangeStart._d);
//						console.log("Date Range End");
//						console.log(dateRangeEnd._d);
						if(startDate.isBefore(dateRangeEnd)) {
							if(endDate.isBefore(dateRangeStart) || endDate.isSame(dateRangeStart)) {
								i--;
							} else {
								if(startDate.isAfter(dateRangeStart)) {
									oldPossibleDates[i].end = new Date(parseInt(startDate.format('x')));
									if(endDate.isBefore(dateRangeEnd)) {
										oldPossibleDates.splice(i+1,0,{start: new Date(parseInt(endDate.format('x'))), end: new Date(parseInt(dateRangeEnd.format('x'))), prio: 0})
									}
								} else if(endDate.isBefore(dateRangeEnd)) {
									oldPossibleDates[i--].start = new Date(parseInt(endDate.format('x')));
								} else {
									oldPossibleDates.splice(i--,1);
								}
							}
							l++;
						}
					}
					event.possDates = oldPossibleDates;
				}
				
				event.possDates = event.possDates.sort(function(a,b) {
					var prio = b.priority - a.priority;
					if(prio == 0) {
						return a.start.getTime() - b.start.getTime();
					} else {
						return prio;
					}
				});
				
				console.log(event.possDates);
				
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
    var currDate = moment(req.query.startDate);
    var lastDate = moment(parseInt(req.query.endDate));
    console.log(lastDate._d);
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().where('sched.end').gt(currDate).where('sched.start').lt(lastDate).populate('owner', 'displayName').populate('proj', 'name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
            	var i;
            	for(i=0; i<events.length;) {
            		//console.log('outer for loop');
            		var curEvent = events[i];
//            		console.log(i);
//            		if(events[i-1]) {
//            			console.log(events[i-1].name);
//                		console.log(events[i-1].sched);
//            		}
//            		console.log(curEvent.name);
//            		console.log(curEvent.sched);
//            		if(events[i+1]) {
//            			console.log(events[i+1].name);
//                		console.log(events[i+1].sched);
//            		}
            		
        			var unrolled = curEvent.recurUnrollNext(currDate,lastDate);
        			events.splice(i, 1);
        			if(unrolled) {
        				var j;
            			for(j=0; j<unrolled.length; j++) {
            				//console.log('inner for loop');
            				events.splice(i++, 0, unrolled[j]);
            			}
        			}
            	}
                res.jsonp(events);
            }
        });
    } else {
        Event.find({$or: [{'owner': req.user._id},{'guests.user': req.user._id}]}).where('sched.end').gt(currDate).where('sched.start').lt(lastDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
            	var i;
            	for(i=0; i<events.length; i++) {
            		var curEvent = events[i];
            		if(curEvent.status == 'personal') {
            			var unrolled = curEvent.recurUnrollNext(currDate,lastDate);
            			events.splice(i, 1);
            			if(unrolled) {
            				var j;
                			for(j=0; j<unrolled.length; j++) {
                				events.splice(i, 0, unrolled[j]);
                				i++;
                			}
            			}
            		}
            	}
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
    
    var i;
    for(i=0; i<event.guests.length; i++) {
    	if(String(event.guests[i].user) == String(user._id)) {
    		if(going) {
    			event.guests[i].status = 'going';
    		} else {
    			event.guests[i].status = 'not going';
    		}
    		break;
    	}
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
	if (req.event.owner.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};