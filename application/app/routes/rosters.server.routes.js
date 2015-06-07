'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rosters = require('../../app/controllers/rosters.server.controller');

	// Rosters Routes
	app.route('/rosters')
		.get(users.requiresLogin, rosters.list)
		.post(users.requiresLogin, rosters.create);

	app.route('/rosters/:rosterId')
		.get(rosters.read)
		.put(users.requiresLogin, rosters.hasAuthorization, rosters.update)
		.delete(users.requiresLogin, rosters.hasAuthorization, rosters.delete);

	// Finish by binding the Roster middleware
	app.param('rosterId', rosters.rosterByID);
};
