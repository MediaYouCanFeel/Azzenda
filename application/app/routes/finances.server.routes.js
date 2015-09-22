'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var finances = require('../../app/controllers/finances.server.controller');

	// Finances Routes
	app.route('/finances')
		.get(users.requiresLogin, finances.list)
		.post(users.requiresLogin, finances.create);

	app.route('/finances/:financeId')
		.get(finances.read)
		.put(users.requiresLogin, finances.hasAuthorization, finances.update)
		.delete(users.requiresLogin, finances.hasAuthorization, finances.delete);

	// Finish by binding the Finance middleware
	app.param('financeId', finances.financeByID);
};
