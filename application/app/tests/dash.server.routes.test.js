'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dash = mongoose.model('Dash'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dash;

/**
 * Dash routes tests
 */
describe('Dash CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dash
		user.save(function() {
			dash = {
				name: 'Dash Name'
			};

			done();
		});
	});

	it('should be able to save Dash instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dash
				agent.post('/dashes')
					.send(dash)
					.expect(200)
					.end(function(dashSaveErr, dashSaveRes) {
						// Handle Dash save error
						if (dashSaveErr) done(dashSaveErr);

						// Get a list of Dashes
						agent.get('/dashes')
							.end(function(dashesGetErr, dashesGetRes) {
								// Handle Dash save error
								if (dashesGetErr) done(dashesGetErr);

								// Get Dashes list
								var dashes = dashesGetRes.body;

								// Set assertions
								(dashes[0].user._id).should.equal(userId);
								(dashes[0].name).should.match('Dash Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dash instance if not logged in', function(done) {
		agent.post('/dashes')
			.send(dash)
			.expect(401)
			.end(function(dashSaveErr, dashSaveRes) {
				// Call the assertion callback
				done(dashSaveErr);
			});
	});

	it('should not be able to save Dash instance if no name is provided', function(done) {
		// Invalidate name field
		dash.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dash
				agent.post('/dashes')
					.send(dash)
					.expect(400)
					.end(function(dashSaveErr, dashSaveRes) {
						// Set message assertion
						(dashSaveRes.body.message).should.match('Please fill Dash name');
						
						// Handle Dash save error
						done(dashSaveErr);
					});
			});
	});

	it('should be able to update Dash instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dash
				agent.post('/dashes')
					.send(dash)
					.expect(200)
					.end(function(dashSaveErr, dashSaveRes) {
						// Handle Dash save error
						if (dashSaveErr) done(dashSaveErr);

						// Update Dash name
						dash.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dash
						agent.put('/dashes/' + dashSaveRes.body._id)
							.send(dash)
							.expect(200)
							.end(function(dashUpdateErr, dashUpdateRes) {
								// Handle Dash update error
								if (dashUpdateErr) done(dashUpdateErr);

								// Set assertions
								(dashUpdateRes.body._id).should.equal(dashSaveRes.body._id);
								(dashUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dashes if not signed in', function(done) {
		// Create new Dash model instance
		var dashObj = new Dash(dash);

		// Save the Dash
		dashObj.save(function() {
			// Request Dashes
			request(app).get('/dashes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dash if not signed in', function(done) {
		// Create new Dash model instance
		var dashObj = new Dash(dash);

		// Save the Dash
		dashObj.save(function() {
			request(app).get('/dashes/' + dashObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dash.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dash instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dash
				agent.post('/dashes')
					.send(dash)
					.expect(200)
					.end(function(dashSaveErr, dashSaveRes) {
						// Handle Dash save error
						if (dashSaveErr) done(dashSaveErr);

						// Delete existing Dash
						agent.delete('/dashes/' + dashSaveRes.body._id)
							.send(dash)
							.expect(200)
							.end(function(dashDeleteErr, dashDeleteRes) {
								// Handle Dash error error
								if (dashDeleteErr) done(dashDeleteErr);

								// Set assertions
								(dashDeleteRes.body._id).should.equal(dashSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dash instance if not signed in', function(done) {
		// Set Dash user 
		dash.user = user;

		// Create new Dash model instance
		var dashObj = new Dash(dash);

		// Save the Dash
		dashObj.save(function() {
			// Try deleting Dash
			request(app).delete('/dashes/' + dashObj._id)
			.expect(401)
			.end(function(dashDeleteErr, dashDeleteRes) {
				// Set message assertion
				(dashDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dash error error
				done(dashDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dash.remove().exec();
		done();
	});
});