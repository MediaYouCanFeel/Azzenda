'use strict';

// Dashes controller
angular.module('dashes').controller('DashesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dashes',
	function($scope, $stateParams, $location, Authentication, Dashes) {
		$scope.authentication = Authentication;

		// Create new Dash
		$scope.create = function() {
			// Create new Dash object
			var dash = new Dashes ({
				name: this.name
			});

			// Redirect after save
			dash.$save(function(response) {
				$location.path('dashes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dash
		$scope.remove = function(dash) {
			if ( dash ) { 
				dash.$remove();

				for (var i in $scope.dashes) {
					if ($scope.dashes [i] === dash) {
						$scope.dashes.splice(i, 1);
					}
				}
			} else {
				$scope.dash.$remove(function() {
					$location.path('dashes');
				});
			}
		};

		// Update existing Dash
		$scope.update = function() {
			var dash = $scope.dash;

			dash.$update(function() {
				$location.path('dashes/' + dash._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashes
		$scope.find = function() {
			$scope.dashes = Dashes.query();
		};

		// Find existing Dash
		$scope.findOne = function() {
			$scope.dash = Dashes.get({ 
				dashId: $stateParams.dashId
			});
		};
	}
]);