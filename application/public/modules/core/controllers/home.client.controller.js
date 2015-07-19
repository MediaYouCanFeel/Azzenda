'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Users',
	function($scope, Authentication, Users) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        
        $scope.showSignUp = function() {
            if ($scope.authentication.user != "") {
                return false;
            } else {
                return true;
            }
        }
        
        // Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
        
        // Find a list of Users
        $scope.userExists = function() {
        	return false;
        }
	}                                 
]);