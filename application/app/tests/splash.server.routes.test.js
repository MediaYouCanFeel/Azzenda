'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Splash = mongoose.model('Splash'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, splash;

/**
 * Splash routes tests
 */
describe('Splash CRUD tests', function() {
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

		// Save a user to the test db and create new Splash
		user.save(function() {
			splash = {
				name: 'Splash Name'
			};

			done();
		});
	});

	it('should be able to save Splash instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Splash
				agent.post('/splashes')
					.send(splash)
					.expect(200)
					.end(function(splashSaveErr, splashSaveRes) {
						// Handle Splash save error
						if (splashSaveErr) done(splashSaveErr);

						// Get a list of Splashes
						agent.get('/splashes')
							.end(function(splashesGetErr, splashesGetRes) {
								// Handle Splash save error
								if (splashesGetErr) done(splashesGetErr);

								// Get Splashes list
								var splashes = splashesGetRes.body;

								// Set assertions
								(splashes[0].user._id).should.equal(userId);
								(splashes[0].name).should.match('Splash Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Splash instance if not logged in', function(done) {
		agent.post('/splashes')
			.send(splash)
			.expect(401)
			.end(function(splashSaveErr, splashSaveRes) {
				// Call the assertion callback
				done(splashSaveErr);
			});
	});

	it('should not be able to save Splash instance if no name is provided', function(done) {
		// Invalidate name field
		splash.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Splash
				agent.post('/splashes')
					.send(splash)
					.expect(400)
					.end(function(splashSaveErr, splashSaveRes) {
						// Set message assertion
						(splashSaveRes.body.message).should.match('Please fill Splash name');
						
						// Handle Splash save error
						done(splashSaveErr);
					});
			});
	});

	it('should be able to update Splash instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Splash
				agent.post('/splashes')
					.send(splash)
					.expect(200)
					.end(function(splashSaveErr, splashSaveRes) {
						// Handle Splash save error
						if (splashSaveErr) done(splashSaveErr);

						// Update Splash name
						splash.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Splash
						agent.put('/splashes/' + splashSaveRes.body._id)
							.send(splash)
							.expect(200)
							.end(function(splashUpdateErr, splashUpdateRes) {
								// Handle Splash update error
								if (splashUpdateErr) done(splashUpdateErr);

								// Set assertions
								(splashUpdateRes.body._id).should.equal(splashSaveRes.body._id);
								(splashUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Splashes if not signed in', function(done) {
		// Create new Splash model instance
		var splashObj = new Splash(splash);

		// Save the Splash
		splashObj.save(function() {
			// Request Splashes
			request(app).get('/splashes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Splash if not signed in', function(done) {
		// Create new Splash model instance
		var splashObj = new Splash(splash);

		// Save the Splash
		splashObj.save(function() {
			request(app).get('/splashes/' + splashObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', splash.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Splash instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Splash
				agent.post('/splashes')
					.send(splash)
					.expect(200)
					.end(function(splashSaveErr, splashSaveRes) {
						// Handle Splash save error
						if (splashSaveErr) done(splashSaveErr);

						// Delete existing Splash
						agent.delete('/splashes/' + splashSaveRes.body._id)
							.send(splash)
							.expect(200)
							.end(function(splashDeleteErr, splashDeleteRes) {
								// Handle Splash error error
								if (splashDeleteErr) done(splashDeleteErr);

								// Set assertions
								(splashDeleteRes.body._id).should.equal(splashSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Splash instance if not signed in', function(done) {
		// Set Splash user 
		splash.user = user;

		// Create new Splash model instance
		var splashObj = new Splash(splash);

		// Save the Splash
		splashObj.save(function() {
			// Try deleting Splash
			request(app).delete('/splashes/' + splashObj._id)
			.expect(401)
			.end(function(splashDeleteErr, splashDeleteRes) {
				// Set message assertion
				(splashDeleteRes.body.message).should.match('User is not logged in');

				// Handle Splash error error
				done(splashDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Splash.remove().exec();
		done();
	});
});