'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var threads = require('../../app/controllers/threads.server.controller');

	// Threads Routes
	app.route('/threads')
		.get(threads.list)
		.post(users.requiresLogin, threads.create);

	app.route('/threads/:threadId')
		.get(threads.read)
		.put(users.requiresLogin, threads.hasAuthorization, threads.update)
		.delete(users.requiresLogin, threads.hasAuthorization, threads.delete);

	// Finish by binding the Thread middleware
	app.param('threadId', threads.threadByID);
};
