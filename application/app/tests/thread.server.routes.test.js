'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Thread = mongoose.model('Thread'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, thread;

/**
 * Thread routes tests
 */
describe('Thread CRUD tests', function() {
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

		// Save a user to the test db and create new Thread
		user.save(function() {
			thread = {
				name: 'Thread Name'
			};

			done();
		});
	});

	it('should be able to save Thread instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thread
				agent.post('/threads')
					.send(thread)
					.expect(200)
					.end(function(threadSaveErr, threadSaveRes) {
						// Handle Thread save error
						if (threadSaveErr) done(threadSaveErr);

						// Get a list of Threads
						agent.get('/threads')
							.end(function(threadsGetErr, threadsGetRes) {
								// Handle Thread save error
								if (threadsGetErr) done(threadsGetErr);

								// Get Threads list
								var threads = threadsGetRes.body;

								// Set assertions
								(threads[0].user._id).should.equal(userId);
								(threads[0].name).should.match('Thread Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Thread instance if not logged in', function(done) {
		agent.post('/threads')
			.send(thread)
			.expect(401)
			.end(function(threadSaveErr, threadSaveRes) {
				// Call the assertion callback
				done(threadSaveErr);
			});
	});

	it('should not be able to save Thread instance if no name is provided', function(done) {
		// Invalidate name field
		thread.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thread
				agent.post('/threads')
					.send(thread)
					.expect(400)
					.end(function(threadSaveErr, threadSaveRes) {
						// Set message assertion
						(threadSaveRes.body.message).should.match('Please fill Thread name');
						
						// Handle Thread save error
						done(threadSaveErr);
					});
			});
	});

	it('should be able to update Thread instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thread
				agent.post('/threads')
					.send(thread)
					.expect(200)
					.end(function(threadSaveErr, threadSaveRes) {
						// Handle Thread save error
						if (threadSaveErr) done(threadSaveErr);

						// Update Thread name
						thread.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Thread
						agent.put('/threads/' + threadSaveRes.body._id)
							.send(thread)
							.expect(200)
							.end(function(threadUpdateErr, threadUpdateRes) {
								// Handle Thread update error
								if (threadUpdateErr) done(threadUpdateErr);

								// Set assertions
								(threadUpdateRes.body._id).should.equal(threadSaveRes.body._id);
								(threadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Threads if not signed in', function(done) {
		// Create new Thread model instance
		var threadObj = new Thread(thread);

		// Save the Thread
		threadObj.save(function() {
			// Request Threads
			request(app).get('/threads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Thread if not signed in', function(done) {
		// Create new Thread model instance
		var threadObj = new Thread(thread);

		// Save the Thread
		threadObj.save(function() {
			request(app).get('/threads/' + threadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', thread.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Thread instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thread
				agent.post('/threads')
					.send(thread)
					.expect(200)
					.end(function(threadSaveErr, threadSaveRes) {
						// Handle Thread save error
						if (threadSaveErr) done(threadSaveErr);

						// Delete existing Thread
						agent.delete('/threads/' + threadSaveRes.body._id)
							.send(thread)
							.expect(200)
							.end(function(threadDeleteErr, threadDeleteRes) {
								// Handle Thread error error
								if (threadDeleteErr) done(threadDeleteErr);

								// Set assertions
								(threadDeleteRes.body._id).should.equal(threadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Thread instance if not signed in', function(done) {
		// Set Thread user 
		thread.user = user;

		// Create new Thread model instance
		var threadObj = new Thread(thread);

		// Save the Thread
		threadObj.save(function() {
			// Try deleting Thread
			request(app).delete('/threads/' + threadObj._id)
			.expect(401)
			.end(function(threadDeleteErr, threadDeleteRes) {
				// Set message assertion
				(threadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Thread error error
				done(threadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Thread.remove().exec();
		done();
	});
});