'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var events = require('../../app/controllers/events.server.controller');

	// Events Routes
	app.route('/events')
		.get(users.requiresLogin, events.list)
		.post(users.requiresLogin, events.create);

	app.route('/events/:eventId')
		.get(events.read)
		.put(users.requiresLogin, events.hasAuthorization, events.update)
		.delete(users.requiresLogin, events.hasAuthorization, events.delete);
    
    app.route('/events/create/getTypes')
        .get(events.getTypes);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};
