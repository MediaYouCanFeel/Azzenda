'use strict';

// Finances controller
angular.module('finances').controller('FinancesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Finances',
	function($scope, $stateParams, $location, Authentication, Finances) {
		$scope.authentication = Authentication;

		// Create new Finance
		$scope.create = function() {
			// Create new Finance object
			var finance = new Finances ({
				name: this.name
			});

			// Redirect after save
			finance.$save(function(response) {
				$location.path('finances/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Finance
		$scope.remove = function(finance) {
			if ( finance ) { 
				finance.$remove();

				for (var i in $scope.finances) {
					if ($scope.finances [i] === finance) {
						$scope.finances.splice(i, 1);
					}
				}
			} else {
				$scope.finance.$remove(function() {
					$location.path('finances');
				});
			}
		};

		// Update existing Finance
		$scope.update = function() {
			var finance = $scope.finance;

			finance.$update(function() {
				$location.path('finances/' + finance._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Finances
		$scope.find = function() {
			$scope.finances = Finances.query();
		};

		// Find existing Finance
		$scope.findOne = function() {
			$scope.finance = Finances.get({ 
				financeId: $stateParams.financeId
			});
		};
	}
]);