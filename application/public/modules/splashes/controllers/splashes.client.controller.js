'use strict';

// Splashes controller
angular.module('splashes').controller('SplashesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Splashes', 'Events',
	function($scope, $stateParams, $location, Authentication, Splashes, Events) {
		$scope.authentication = Authentication;

		// Create new Splash
		$scope.create = function() {
			// Create new Splash object
			var splash = new Splashes ({
				name: this.name
			});

			// Redirect after save
			splash.$save(function(response) {
				$location.path('splashes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Splash
		$scope.remove = function(splash) {
			if ( splash ) { 
				splash.$remove();

				for (var i in $scope.splashes) {
					if ($scope.splashes [i] === splash) {
						$scope.splashes.splice(i, 1);
					}
				}
			} else {
				$scope.splash.$remove(function() {
					$location.path('splashes');
				});
			}
		};

		// Update existing Splash
		$scope.update = function() {
			var splash = $scope.splash;

			splash.$update(function() {
				$location.path('splashes/' + splash._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Splashes
		$scope.find = function() {
			$scope.splashes = Splashes.query();
		};

		// Find existing Splash
		$scope.findOne = function() {
			$scope.splash = Splashes.get({ 
				splashId: $stateParams.splashId
			});
		};

        // Find a list of Events
        $scope.findEvents = function() {
            $scope.events = Events.query();
        };
	}
]);