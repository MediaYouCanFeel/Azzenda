'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var events = require('../../app/controllers/events.server.controller');

	// Events Routes
	app.route('/events')
		.get(users.requiresLogin, function(req, res) {
			if(req.query.types) {
				events.listTypes(req,res);
			} else if(req.query.locations) {
				events.listLocations(req,res);
			} else {
				events.list(req,res);
			}
		})
		.post(users.requiresLogin, events.create);

	app.route('/events/:eventId')
		.get(users.requiresLogin, events.read)
		.put(users.requiresLogin, function(req, res, next) {
			if(req.body.going != null) {
				events.rsvp(req, res);
			} else if(req.body.schedule) {
				events.schedule(req, res);
			} else {
				events.hasAuthorization(req, res, next);
			}
		}, events.update})
		.delete(users.requiresLogin, events.hasAuthorization, events.delete);

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};
