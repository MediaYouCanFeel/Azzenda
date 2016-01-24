'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', '$location',
	function($scope, $http, Authentication, Menus, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
        
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
		$scope.isActive = function (viewLocation) { 
	        return $location.path().startsWith(viewLocation);
	    };	
		
	    $scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;
			
			var credentials = {};
			credentials.username = $scope.authentication.user.username;

			$http.post('/auth/forgot', credentials).success(function(response) {
				// Show user success message and clear form
				//$scope.credentials = null;
				//$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				//$scope.credentials = null;
				//$scope.error = response.message;
			});
		};
	}
]);