'use strict';

angular.module('users').controller('RostersController', ['$scope', 'Users',
	function($scope, Users) {

        // Find a list of Users
		$scope.findUsers = function() {
			$scope.users = Users.query();
		};
            
		$scope.search = function(element) {
			if ($scope.searchText == "" || !$scope.searchText) {
				return true;
			} else if (element.displayName.toLowerCase().contains($scope.searchText.toLowerCase())){
				return true;
			} else {
				return false;
			}
		}
		
	}
]);