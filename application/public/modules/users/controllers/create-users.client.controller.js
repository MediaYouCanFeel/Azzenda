'use strict';

angular.module('users').controller('CreateUsersController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.authentication = Authentication;



		$scope.createuser = function() {
			$http.post('/auth/createuser', $scope.credentials).success(function(response) {
                
                console.log("PRE-CHANGE: " + $scope.credentials);
                
                if ($scope.credentials.isAdmin) {
                    $scope.credentials.roles = ['admin'];
                } else {
                    $scope.credentials.roles = ['user'];
                }
                
                console.log("POST-CHANGE: " + $scope.credentials);
                
				// And redirect to the roster page
				$location.path('/roster');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.isAdmin = function()
		{
			//console.log($scope.authentication.user.isAdmin);
			return $scope.authentication.user.isAdmin;
		};
	}
]);