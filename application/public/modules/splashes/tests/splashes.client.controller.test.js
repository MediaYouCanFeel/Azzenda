'use strict';

(function() {
	// Splashes Controller Spec
	describe('Splashes Controller Tests', function() {
		// Initialize global variables
		var SplashesController,
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

			// Initialize the Splashes controller.
			SplashesController = $controller('SplashesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Splash object fetched from XHR', inject(function(Splashes) {
			// Create sample Splash using the Splashes service
			var sampleSplash = new Splashes({
				name: 'New Splash'
			});

			// Create a sample Splashes array that includes the new Splash
			var sampleSplashes = [sampleSplash];

			// Set GET response
			$httpBackend.expectGET('splashes').respond(sampleSplashes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.splashes).toEqualData(sampleSplashes);
		}));

		it('$scope.findOne() should create an array with one Splash object fetched from XHR using a splashId URL parameter', inject(function(Splashes) {
			// Define a sample Splash object
			var sampleSplash = new Splashes({
				name: 'New Splash'
			});

			// Set the URL parameter
			$stateParams.splashId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/splashes\/([0-9a-fA-F]{24})$/).respond(sampleSplash);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.splash).toEqualData(sampleSplash);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Splashes) {
			// Create a sample Splash object
			var sampleSplashPostData = new Splashes({
				name: 'New Splash'
			});

			// Create a sample Splash response
			var sampleSplashResponse = new Splashes({
				_id: '525cf20451979dea2c000001',
				name: 'New Splash'
			});

			// Fixture mock form input values
			scope.name = 'New Splash';

			// Set POST response
			$httpBackend.expectPOST('splashes', sampleSplashPostData).respond(sampleSplashResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Splash was created
			expect($location.path()).toBe('/splashes/' + sampleSplashResponse._id);
		}));

		it('$scope.update() should update a valid Splash', inject(function(Splashes) {
			// Define a sample Splash put data
			var sampleSplashPutData = new Splashes({
				_id: '525cf20451979dea2c000001',
				name: 'New Splash'
			});

			// Mock Splash in scope
			scope.splash = sampleSplashPutData;

			// Set PUT response
			$httpBackend.expectPUT(/splashes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/splashes/' + sampleSplashPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid splashId and remove the Splash from the scope', inject(function(Splashes) {
			// Create new Splash object
			var sampleSplash = new Splashes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Splashes array and include the Splash
			scope.splashes = [sampleSplash];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/splashes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSplash);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.splashes.length).toBe(0);
		}));
	});
}());