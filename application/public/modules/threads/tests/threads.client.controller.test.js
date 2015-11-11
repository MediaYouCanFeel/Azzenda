'use strict';

(function() {
	// Threads Controller Spec
	describe('Threads Controller Tests', function() {
		// Initialize global variables
		var ThreadsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Threads controller.
			ThreadsController = $controller('ThreadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Thread object fetched from XHR', inject(function(Threads) {
			// Create sample Thread using the Threads service
			var sampleThread = new Threads({
				name: 'New Thread'
			});

			// Create a sample Threads array that includes the new Thread
			var sampleThreads = [sampleThread];

			// Set GET response
			$httpBackend.expectGET('threads').respond(sampleThreads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.threads).toEqualData(sampleThreads);
		}));

		it('$scope.findOne() should create an array with one Thread object fetched from XHR using a threadId URL parameter', inject(function(Threads) {
			// Define a sample Thread object
			var sampleThread = new Threads({
				name: 'New Thread'
			});

			// Set the URL parameter
			$stateParams.threadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/threads\/([0-9a-fA-F]{24})$/).respond(sampleThread);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.thread).toEqualData(sampleThread);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Threads) {
			// Create a sample Thread object
			var sampleThreadPostData = new Threads({
				name: 'New Thread'
			});

			// Create a sample Thread response
			var sampleThreadResponse = new Threads({
				_id: '525cf20451979dea2c000001',
				name: 'New Thread'
			});

			// Fixture mock form input values
			scope.name = 'New Thread';

			// Set POST response
			$httpBackend.expectPOST('threads', sampleThreadPostData).respond(sampleThreadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Thread was created
			expect($location.path()).toBe('/threads/' + sampleThreadResponse._id);
		}));

		it('$scope.update() should update a valid Thread', inject(function(Threads) {
			// Define a sample Thread put data
			var sampleThreadPutData = new Threads({
				_id: '525cf20451979dea2c000001',
				name: 'New Thread'
			});

			// Mock Thread in scope
			scope.thread = sampleThreadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/threads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/threads/' + sampleThreadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid threadId and remove the Thread from the scope', inject(function(Threads) {
			// Create new Thread object
			var sampleThread = new Threads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Threads array and include the Thread
			scope.threads = [sampleThread];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/threads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleThread);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.threads.length).toBe(0);
		}));
	});
}());