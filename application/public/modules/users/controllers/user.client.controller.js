'use strict';

// Rosters controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Upload', '$modal', '$state',
	function($scope, $stateParams, $location, Authentication, Users, Upload, $modal, $state) {
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

		$scope.updateProfPicModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/users/views/update-prof-pic.client.view.html',
              controller: function ($scope, $modalInstance, items) {
            	  $scope.ok = function () {
                      //$scope.selected.event
                	  modalInstance.close();
                  };

                  $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                  };
              },
              size: size,
              resolve: {
                items: function () {
                	//return $scope.events;
                }
              }
            });
            
            modalInstance.result.then(function() {
            	$scope.showProfPicUrl();
            });
        }; 
        
        
        $scope.updateProfPic = function(croppedDataUrl) {
        	$scope.setUrl(croppedDataUrl); 
        	$scope.ok(); 
        	$scope.showProfPicUrl();
        	$scope.update();
        	
        }
		
        $scope.picSelected = function(files) {
			if(files && (files.length > 0)) {
				$stateParams.activePic = true;
			} else {
				$stateParams.activePic = false;
			}
		}
        
        $scope.setUrl = function(croppedDataUrl) {
        	$stateParams.url = croppedDataUrl;
        }
        
        $scope.showProfPicUrl = function() {
        	$scope.url = $stateParams.url;
        }
        
		// Update existing User
		$scope.update = function() {
			var userWantsToUpdateProfPic = true;
			//this allows for the update of any member, not just the current user
			var user = $scope.user;
			if(userWantsToUpdateProfPic) {
				Upload.upload({
					url: '/users/' + $stateParams.userId + "/", 
					method: 'PUT', 
					headers: {'Content-Type': 'multipart/form-data'},
					fields: {
						activeImg: $stateParams.activePic
						//after active img, list any fields you would like updated
						//in the user object (other than prof pic). Only the fields
						//you list will be updated. Only non-security related fields
						// can be updated in this way (i.e. not password, roles, etc).
						//Below are some examples. These are not required!
					},
					file: Upload.dataUrltoBlob($scope.url)               
				}).success(function (response, status) {
					$state.go($state.current, {}, {reload: true});
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