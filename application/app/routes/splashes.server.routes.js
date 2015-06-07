'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var splashes = require('../../app/controllers/splashes.server.controller');

	// Splashes Routes
	app.route('/splashes')
		.get(users.requiresLogin, splashes.list)
		.post(users.requiresLogin, splashes.create);

	app.route('/splashes/:splashId')
		.get(splashes.read)
		.put(users.requiresLogin, splashes.hasAuthorization, splashes.update)
		.delete(users.requiresLogin, splashes.hasAuthorization, splashes.delete);

	// Finish by binding the Splash middleware
	app.param('splashId', splashes.splashByID);
};
