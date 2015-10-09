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
		var evType = req.body.type;
	    delete req.body.type;
	    var evLoc = req.body.location;
	    delete req.body.location;
	    var guests = req.body.guests;
	    delete req.body.guests;
		var event = new Event(req.body);
		event.owner = req.user;
		event.possDates = {
				start: parseInt(moment().add(1, 'hour').format('x')),
				end: parseInt(moment().add(7, 'day').add(1, 'hour').format('x')),
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
		console.log(guests);
		Event.find({status: 'personal'}).where('owner').in(guests).where('sched.end').gt(new Date()).sort('sched.start').exec(function(err,userEvents) {
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
				var j
				for(j=0; j<guests.length; j++) {
					var curGuest = guests[j];
					event.guests.push({
						user: curGuest,
						status: 'invited'
					});
					var k;
					var curUserEvents = [];
					for(k=0; k<userEvents.length; k++) {
						if(userEvents[k].owner == curGuest) {
							curUserEvents.push(userEvents[k]);
						}
					}
					var oldPossibleDates = event.possDates;
					var i;
					var l=0;
					for(i=0; i<oldPossibleDates.length && l<curUserEvents.length; i++) {
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
							console.log("in here");
							if(endDate.isBefore(dateRangeStart)) {
								i--;
							} else {
								if(startDate.isAfter(dateRangeStart)) {
									oldPossibleDates[i].end = new Date(parseInt(startDate.format('x')));
									if(endDate.isBefore(dateRangeEnd)) {
										oldPossibleDates.splice(i+1,0,{start: new Date(parseInt(endDate.format('x'))), end: new Date(parseInt(dateRangeEnd.format('x'))), prio: 0})
									}
								} else if(endDate.isBefore(dateRangeEnd)) {
									oldPossibleDates[i].start = new Date(parseInt(endDate.format('x')));
								} else {
									oldPossibleDates.splice(i,1);
									i--;
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
exports.listUpcoming = function(req, res) {
    var roles = ['admin'];
    var currDate = new Date();
    var lastDate = new Date(parseInt(moment(currDate).add(6, 'week').format('x')));
    console.log(currDate);
    if(_.intersection(req.user.roles,roles).length) {
        Event.find().where('sched.end').gt(currDate).where('sched.start').lt(lastDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
            	var i;
            	//console.log(events);
            	for(i=0; i<events.length; i++) {
            		var curEvent = events[i];
            		if(curEvent.status == 'personal') {
            			console.log('test');
            			var unrolled = curEvent.recurUnrollNext(currDate,lastDate);
            			//console.log(unrolled);
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
    } else {
        Event.find({$or: [{'owner': req.user._id},{'guests.user': req.user._id}]}).where('sched.end').gt(currDate).where('sched.start').lt(lastDate).sort('-created').populate('owner', 'displayName').populate('proj', 'name').populate('type', 'name').populate('location','name').exec(function(err, events) {
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