'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var skills = require('../../app/controllers/skills.server.controller');

	// Skills Routes
	app.route('/skills')
		.get(users.requiresLogin, skills.list)
		.post(users.requiresLogin, skills.create);

	app.route('/skills/:skillId')
		.get(skills.read)
		.put(users.requiresLogin, skills.hasAuthorization, skills.update)
		.delete(users.requiresLogin, skills.hasAuthorization, skills.delete);

	// Finish by binding the Skill middleware
	app.param('skillId', skills.skillByID);
};
