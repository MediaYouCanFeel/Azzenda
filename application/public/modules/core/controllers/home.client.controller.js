'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        
        $scope.showSignUp = function() {
            if ($scope.authentication.user != "") {
                return false;
            } else {
                return true;
            }
        }
	}                                 
]);