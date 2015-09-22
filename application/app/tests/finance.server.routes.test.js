'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Finance = mongoose.model('Finance'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, finance;

/**
 * Finance routes tests
 */
describe('Finance CRUD tests', function() {
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

		// Save a user to the test db and create new Finance
		user.save(function() {
			finance = {
				name: 'Finance Name'
			};

			done();
		});
	});

	it('should be able to save Finance instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Finance
				agent.post('/finances')
					.send(finance)
					.expect(200)
					.end(function(financeSaveErr, financeSaveRes) {
						// Handle Finance save error
						if (financeSaveErr) done(financeSaveErr);

						// Get a list of Finances
						agent.get('/finances')
							.end(function(financesGetErr, financesGetRes) {
								// Handle Finance save error
								if (financesGetErr) done(financesGetErr);

								// Get Finances list
								var finances = financesGetRes.body;

								// Set assertions
								(finances[0].user._id).should.equal(userId);
								(finances[0].name).should.match('Finance Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Finance instance if not logged in', function(done) {
		agent.post('/finances')
			.send(finance)
			.expect(401)
			.end(function(financeSaveErr, financeSaveRes) {
				// Call the assertion callback
				done(financeSaveErr);
			});
	});

	it('should not be able to save Finance instance if no name is provided', function(done) {
		// Invalidate name field
		finance.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Finance
				agent.post('/finances')
					.send(finance)
					.expect(400)
					.end(function(financeSaveErr, financeSaveRes) {
						// Set message assertion
						(financeSaveRes.body.message).should.match('Please fill Finance name');
						
						// Handle Finance save error
						done(financeSaveErr);
					});
			});
	});

	it('should be able to update Finance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Finance
				agent.post('/finances')
					.send(finance)
					.expect(200)
					.end(function(financeSaveErr, financeSaveRes) {
						// Handle Finance save error
						if (financeSaveErr) done(financeSaveErr);

						// Update Finance name
						finance.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Finance
						agent.put('/finances/' + financeSaveRes.body._id)
							.send(finance)
							.expect(200)
							.end(function(financeUpdateErr, financeUpdateRes) {
								// Handle Finance update error
								if (financeUpdateErr) done(financeUpdateErr);

								// Set assertions
								(financeUpdateRes.body._id).should.equal(financeSaveRes.body._id);
								(financeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Finances if not signed in', function(done) {
		// Create new Finance model instance
		var financeObj = new Finance(finance);

		// Save the Finance
		financeObj.save(function() {
			// Request Finances
			request(app).get('/finances')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Finance if not signed in', function(done) {
		// Create new Finance model instance
		var financeObj = new Finance(finance);

		// Save the Finance
		financeObj.save(function() {
			request(app).get('/finances/' + financeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', finance.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Finance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Finance
				agent.post('/finances')
					.send(finance)
					.expect(200)
					.end(function(financeSaveErr, financeSaveRes) {
						// Handle Finance save error
						if (financeSaveErr) done(financeSaveErr);

						// Delete existing Finance
						agent.delete('/finances/' + financeSaveRes.body._id)
							.send(finance)
							.expect(200)
							.end(function(financeDeleteErr, financeDeleteRes) {
								// Handle Finance error error
								if (financeDeleteErr) done(financeDeleteErr);

								// Set assertions
								(financeDeleteRes.body._id).should.equal(financeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Finance instance if not signed in', function(done) {
		// Set Finance user 
		finance.user = user;

		// Create new Finance model instance
		var financeObj = new Finance(finance);

		// Save the Finance
		financeObj.save(function() {
			// Try deleting Finance
			request(app).delete('/finances/' + financeObj._id)
			.expect(401)
			.end(function(financeDeleteErr, financeDeleteRes) {
				// Set message assertion
				(financeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Finance error error
				done(financeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Finance.remove().exec();
		done();
	});
});