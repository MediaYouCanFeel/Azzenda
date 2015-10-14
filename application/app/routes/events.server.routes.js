'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var events = require('../../app/controllers/events.server.controller');

	// Events Routes
	app.route('/events')
		.put(users.requiresLogin, events.list)
		.post(users.requiresLogin, events.create);

	app.route('/events/:eventId')
		.get(users.requiresLogin, events.read)
		.put(users.requiresLogin, events.hasAuthorization, events.update)
		.delete(users.requiresLogin, events.hasAuthorization, events.delete);
	
	app.route('/events/update/rsvp/:eventId')
		.put(users.requiresLogin, events.rsvp);
    
    app.route('/events/create/types')
        .get(users.requiresLogin, events.getTypes)
        .post(users.requiresLogin, events.addType);
    
    app.route('/events/create/locations')
    	.get(users.requiresLogin, events.getLocations);
        
    app.route('events/create/types/:eventTypeId')
        .put(users.requiresLogin, events.updateType);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
    app.param('eventTypeId', events.eventTypeByID);
};
