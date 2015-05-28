'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Roster = mongoose.model('Roster'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, roster;

/**
 * Roster routes tests
 */
describe('Roster CRUD tests', function() {
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

		// Save a user to the test db and create new Roster
		user.save(function() {
			roster = {
				name: 'Roster Name'
			};

			done();
		});
	});

	it('should be able to save Roster instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roster
				agent.post('/rosters')
					.send(roster)
					.expect(200)
					.end(function(rosterSaveErr, rosterSaveRes) {
						// Handle Roster save error
						if (rosterSaveErr) done(rosterSaveErr);

						// Get a list of Rosters
						agent.get('/rosters')
							.end(function(rostersGetErr, rostersGetRes) {
								// Handle Roster save error
								if (rostersGetErr) done(rostersGetErr);

								// Get Rosters list
								var rosters = rostersGetRes.body;

								// Set assertions
								(rosters[0].user._id).should.equal(userId);
								(rosters[0].name).should.match('Roster Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Roster instance if not logged in', function(done) {
		agent.post('/rosters')
			.send(roster)
			.expect(401)
			.end(function(rosterSaveErr, rosterSaveRes) {
				// Call the assertion callback
				done(rosterSaveErr);
			});
	});

	it('should not be able to save Roster instance if no name is provided', function(done) {
		// Invalidate name field
		roster.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roster
				agent.post('/rosters')
					.send(roster)
					.expect(400)
					.end(function(rosterSaveErr, rosterSaveRes) {
						// Set message assertion
						(rosterSaveRes.body.message).should.match('Please fill Roster name');
						
						// Handle Roster save error
						done(rosterSaveErr);
					});
			});
	});

	it('should be able to update Roster instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roster
				agent.post('/rosters')
					.send(roster)
					.expect(200)
					.end(function(rosterSaveErr, rosterSaveRes) {
						// Handle Roster save error
						if (rosterSaveErr) done(rosterSaveErr);

						// Update Roster name
						roster.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Roster
						agent.put('/rosters/' + rosterSaveRes.body._id)
							.send(roster)
							.expect(200)
							.end(function(rosterUpdateErr, rosterUpdateRes) {
								// Handle Roster update error
								if (rosterUpdateErr) done(rosterUpdateErr);

								// Set assertions
								(rosterUpdateRes.body._id).should.equal(rosterSaveRes.body._id);
								(rosterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rosters if not signed in', function(done) {
		// Create new Roster model instance
		var rosterObj = new Roster(roster);

		// Save the Roster
		rosterObj.save(function() {
			// Request Rosters
			request(app).get('/rosters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Roster if not signed in', function(done) {
		// Create new Roster model instance
		var rosterObj = new Roster(roster);

		// Save the Roster
		rosterObj.save(function() {
			request(app).get('/rosters/' + rosterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', roster.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Roster instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roster
				agent.post('/rosters')
					.send(roster)
					.expect(200)
					.end(function(rosterSaveErr, rosterSaveRes) {
						// Handle Roster save error
						if (rosterSaveErr) done(rosterSaveErr);

						// Delete existing Roster
						agent.delete('/rosters/' + rosterSaveRes.body._id)
							.send(roster)
							.expect(200)
							.end(function(rosterDeleteErr, rosterDeleteRes) {
								// Handle Roster error error
								if (rosterDeleteErr) done(rosterDeleteErr);

								// Set assertions
								(rosterDeleteRes.body._id).should.equal(rosterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Roster instance if not signed in', function(done) {
		// Set Roster user 
		roster.user = user;

		// Create new Roster model instance
		var rosterObj = new Roster(roster);

		// Save the Roster
		rosterObj.save(function() {
			// Try deleting Roster
			request(app).delete('/rosters/' + rosterObj._id)
			.expect(401)
			.end(function(rosterDeleteErr, rosterDeleteRes) {
				// Set message assertion
				(rosterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Roster error error
				done(rosterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Roster.remove().exec();
		done();
	});
});