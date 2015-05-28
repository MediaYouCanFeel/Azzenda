'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Settings',
	function($scope, $stateParams, $location, Authentication, Settings) {
		$scope.authentication = Authentication;

		// Create new Setting
		$scope.create = function() {
			// Create new Setting object
			var setting = new Settings ({
				name: this.name
			});

			// Redirect after save
			setting.$save(function(response) {
				$location.path('settings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Setting
		$scope.remove = function(setting) {
			if ( setting ) { 
				setting.$remove();

				for (var i in $scope.settings) {
					if ($scope.settings [i] === setting) {
						$scope.settings.splice(i, 1);
					}
				}
			} else {
				$scope.setting.$remove(function() {
					$location.path('settings');
				});
			}
		};

		// Update existing Setting
		$scope.update = function() {
			var setting = $scope.setting;

			setting.$update(function() {
				$location.path('settings/' + setting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Settings
		$scope.find = function() {
			$scope.settings = Settings.query();
		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);