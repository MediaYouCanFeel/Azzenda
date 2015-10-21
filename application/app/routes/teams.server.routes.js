'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var teams = require('../../app/controllers/teams.server.controller');
	var threads = require('../../app/controllers/threads.server.controller');

	// Teams Routes
	app.route('/teams')
		.get(users.requiresLogin, teams.list)
		.post(users.requiresLogin, teams.create);

	app.route('/teams/:teamId')
		.get(teams.read)
		.put(users.requiresLogin, teams.hasAuthorization, teams.update)
		.delete(users.requiresLogin, teams.hasAuthorization, teams.delete);

	// Finish by binding the Team middleware
	app.param('teamId', teams.teamByID);
};
