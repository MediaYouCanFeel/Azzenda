'use strict';

angular.module('users').controller('CreateUsersController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.authentication = Authentication;
        
        //dropdown init
        angular.element('select').select2({ width: '100%' });
        
        $scope.findRoles = function() {
            $scope.roles = ['user','admin'];
        };

		$scope.createuser = function() {
			$http.post('/users', $scope.credentials).success(function(response) {
                
				// And redirect to the roster page
				$location.path('/users');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);