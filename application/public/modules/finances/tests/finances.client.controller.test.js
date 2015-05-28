'use strict';

(function() {
	// Finances Controller Spec
	describe('Finances Controller Tests', function() {
		// Initialize global variables
		var FinancesController,
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

			// Initialize the Finances controller.
			FinancesController = $controller('FinancesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Finance object fetched from XHR', inject(function(Finances) {
			// Create sample Finance using the Finances service
			var sampleFinance = new Finances({
				name: 'New Finance'
			});

			// Create a sample Finances array that includes the new Finance
			var sampleFinances = [sampleFinance];

			// Set GET response
			$httpBackend.expectGET('finances').respond(sampleFinances);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.finances).toEqualData(sampleFinances);
		}));

		it('$scope.findOne() should create an array with one Finance object fetched from XHR using a financeId URL parameter', inject(function(Finances) {
			// Define a sample Finance object
			var sampleFinance = new Finances({
				name: 'New Finance'
			});

			// Set the URL parameter
			$stateParams.financeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/finances\/([0-9a-fA-F]{24})$/).respond(sampleFinance);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.finance).toEqualData(sampleFinance);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Finances) {
			// Create a sample Finance object
			var sampleFinancePostData = new Finances({
				name: 'New Finance'
			});

			// Create a sample Finance response
			var sampleFinanceResponse = new Finances({
				_id: '525cf20451979dea2c000001',
				name: 'New Finance'
			});

			// Fixture mock form input values
			scope.name = 'New Finance';

			// Set POST response
			$httpBackend.expectPOST('finances', sampleFinancePostData).respond(sampleFinanceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Finance was created
			expect($location.path()).toBe('/finances/' + sampleFinanceResponse._id);
		}));

		it('$scope.update() should update a valid Finance', inject(function(Finances) {
			// Define a sample Finance put data
			var sampleFinancePutData = new Finances({
				_id: '525cf20451979dea2c000001',
				name: 'New Finance'
			});

			// Mock Finance in scope
			scope.finance = sampleFinancePutData;

			// Set PUT response
			$httpBackend.expectPUT(/finances\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/finances/' + sampleFinancePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financeId and remove the Finance from the scope', inject(function(Finances) {
			// Create new Finance object
			var sampleFinance = new Finances({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Finances array and include the Finance
			scope.finances = [sampleFinance];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/finances\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinance);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.finances.length).toBe(0);
		}));
	});
}());