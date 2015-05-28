'use strict';

// Rosters controller
angular.module('rosters').controller('RostersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rosters',
	function($scope, $stateParams, $location, Authentication, Rosters) {
		$scope.authentication = Authentication;

		// Create new Roster
		$scope.create = function() {
			// Create new Roster object
			var roster = new Rosters ({
				name: this.name
			});

			// Redirect after save
			roster.$save(function(response) {
				$location.path('rosters/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Roster
		$scope.remove = function(roster) {
			if ( roster ) { 
				roster.$remove();

				for (var i in $scope.rosters) {
					if ($scope.rosters [i] === roster) {
						$scope.rosters.splice(i, 1);
					}
				}
			} else {
				$scope.roster.$remove(function() {
					$location.path('rosters');
				});
			}
		};

		// Update existing Roster
		$scope.update = function() {
			var roster = $scope.roster;

			roster.$update(function() {
				$location.path('rosters/' + roster._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rosters
		$scope.find = function() {
			$scope.rosters = Rosters.query();
		};

		// Find existing Roster
		$scope.findOne = function() {
			$scope.roster = Rosters.get({ 
				rosterId: $stateParams.rosterId
			});
		};
	}
]);