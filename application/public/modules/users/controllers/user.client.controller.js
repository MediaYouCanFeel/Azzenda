'use strict';

// Rosters controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope, $stateParams, $location, Authentication, Users) {
		$scope.authentication = Authentication;

		// Remove existing User
		$scope.remove = function(user) {
			if ( user ) { 
				user.$remove();

				for (var i in $scope.users) {
					if ($scope.users [i] === user) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};

		// Update existing User
		$scope.update = function() {
			//this allows for the update of any member, not just the current user
			var user = $scope.user;
			if(userWantsToUpdateProfPic) {
				Upload.upload({
					url: '/users', 
					method: 'PUT', 
					headers: {'Content-Type': 'multipart/form-data'},
					fields: {
						activeImg: $stateParams.activePic,
						//after active img, list any fields you would like updated
						//in the user object (other than prof pic). Only the fields
						//you list will be updated. Only non-security related fields
						// can be updated in this way (i.e. not password, roles, etc).
						//Below are some examples. These are not required!
						firstName: $scope.something1,
						lastName: $scope.something2
					},
					file: Upload.dataUrltoBlob($scope.url)               
				}).success(function (response, status) {
					// Do something if it worked
				}).error(function (err) {
					$scope.error = err.message;
				});
			} else {
				$scope.user = Users.update({
					_id: user._id,
					//after _id, list any fields you would like updated
					//in the user object. Only the fields you list will be updated.
					//Only non-security related fields can be updated in this way
					//(i.e. not password, roles, etc)
					//below are some examples. These are not required!
					firstName: $scope.something1,
					lastName: $scope.something2
				}, function() {
					$location.path('users/' + user._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
			
			//old update function
//			user.$update(function() {
//				$location.path('users/' + user._id);
//			}, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
		};

		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing User
		$scope.findOne = function() {
			$scope.user = Users.get({ 
				userId: $stateParams.userId
			});
		};
	}
]);