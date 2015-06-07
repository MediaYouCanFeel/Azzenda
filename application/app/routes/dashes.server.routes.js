'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dashes = require('../../app/controllers/dashes.server.controller');

	// Dashes Routes
	app.route('/dashes')
		.get(dashes.list)
		.post(users.requiresLogin, dashes.create);

	app.route('/dashes/:dashId')
		.get(dashes.read)
		.put(users.requiresLogin, dashes.hasAuthorization, dashes.update)
		.delete(users.requiresLogin, dashes.hasAuthorization, dashes.delete);

	// Finish by binding the Dash middleware
	app.param('dashId', dashes.dashByID);
};
