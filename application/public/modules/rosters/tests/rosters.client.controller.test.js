'use strict';

(function() {
	// Rosters Controller Spec
	describe('Rosters Controller Tests', function() {
		// Initialize global variables
		var RostersController,
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

			// Initialize the Rosters controller.
			RostersController = $controller('RostersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Roster object fetched from XHR', inject(function(Rosters) {
			// Create sample Roster using the Rosters service
			var sampleRoster = new Rosters({
				name: 'New Roster'
			});

			// Create a sample Rosters array that includes the new Roster
			var sampleRosters = [sampleRoster];

			// Set GET response
			$httpBackend.expectGET('rosters').respond(sampleRosters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rosters).toEqualData(sampleRosters);
		}));

		it('$scope.findOne() should create an array with one Roster object fetched from XHR using a rosterId URL parameter', inject(function(Rosters) {
			// Define a sample Roster object
			var sampleRoster = new Rosters({
				name: 'New Roster'
			});

			// Set the URL parameter
			$stateParams.rosterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rosters\/([0-9a-fA-F]{24})$/).respond(sampleRoster);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roster).toEqualData(sampleRoster);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rosters) {
			// Create a sample Roster object
			var sampleRosterPostData = new Rosters({
				name: 'New Roster'
			});

			// Create a sample Roster response
			var sampleRosterResponse = new Rosters({
				_id: '525cf20451979dea2c000001',
				name: 'New Roster'
			});

			// Fixture mock form input values
			scope.name = 'New Roster';

			// Set POST response
			$httpBackend.expectPOST('rosters', sampleRosterPostData).respond(sampleRosterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Roster was created
			expect($location.path()).toBe('/rosters/' + sampleRosterResponse._id);
		}));

		it('$scope.update() should update a valid Roster', inject(function(Rosters) {
			// Define a sample Roster put data
			var sampleRosterPutData = new Rosters({
				_id: '525cf20451979dea2c000001',
				name: 'New Roster'
			});

			// Mock Roster in scope
			scope.roster = sampleRosterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rosters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rosters/' + sampleRosterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rosterId and remove the Roster from the scope', inject(function(Rosters) {
			// Create new Roster object
			var sampleRoster = new Rosters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rosters array and include the Roster
			scope.rosters = [sampleRoster];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rosters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRoster);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rosters.length).toBe(0);
		}));
	});
}());