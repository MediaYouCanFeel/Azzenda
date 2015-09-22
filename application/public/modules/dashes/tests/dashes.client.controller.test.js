'use strict';

(function() {
	// Dashes Controller Spec
	describe('Dashes Controller Tests', function() {
		// Initialize global variables
		var DashesController,
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

			// Initialize the Dashes controller.
			DashesController = $controller('DashesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dash object fetched from XHR', inject(function(Dashes) {
			// Create sample Dash using the Dashes service
			var sampleDash = new Dashes({
				name: 'New Dash'
			});

			// Create a sample Dashes array that includes the new Dash
			var sampleDashes = [sampleDash];

			// Set GET response
			$httpBackend.expectGET('dashes').respond(sampleDashes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dashes).toEqualData(sampleDashes);
		}));

		it('$scope.findOne() should create an array with one Dash object fetched from XHR using a dashId URL parameter', inject(function(Dashes) {
			// Define a sample Dash object
			var sampleDash = new Dashes({
				name: 'New Dash'
			});

			// Set the URL parameter
			$stateParams.dashId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dashes\/([0-9a-fA-F]{24})$/).respond(sampleDash);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dash).toEqualData(sampleDash);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dashes) {
			// Create a sample Dash object
			var sampleDashPostData = new Dashes({
				name: 'New Dash'
			});

			// Create a sample Dash response
			var sampleDashResponse = new Dashes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dash'
			});

			// Fixture mock form input values
			scope.name = 'New Dash';

			// Set POST response
			$httpBackend.expectPOST('dashes', sampleDashPostData).respond(sampleDashResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dash was created
			expect($location.path()).toBe('/dashes/' + sampleDashResponse._id);
		}));

		it('$scope.update() should update a valid Dash', inject(function(Dashes) {
			// Define a sample Dash put data
			var sampleDashPutData = new Dashes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dash'
			});

			// Mock Dash in scope
			scope.dash = sampleDashPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dashes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dashes/' + sampleDashPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dashId and remove the Dash from the scope', inject(function(Dashes) {
			// Create new Dash object
			var sampleDash = new Dashes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dashes array and include the Dash
			scope.dashes = [sampleDash];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dashes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDash);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dashes.length).toBe(0);
		}));
	});
}());