'use strict';

angular.module('users').controller('CreateUsersController', ['$scope', '$stateParams', '$http', '$location', 'Users', 'Authentication', 'Upload', '$modal',
	function($scope, $stateParams, $http, $location, Users, Authentication, Upload, $modal) {
		$scope.authentication = Authentication;
		$stateParams.activePic = false;
        //dropdown init
        angular.element('select').select2({ width: '100%' });
        
//        $scope.findRoles = function() {
//            $scope.roles = ['user','admin'];
//        };
		
        $scope.uploadProfPicModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/users/views/upload-prof-pic.client.view.html',
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
        
        $scope.doProfPicEndStuff = function(croppedDataUrl) {
        	$scope.setUrl(croppedDataUrl); 
        	$scope.ok(); 
        	$scope.showProfPicUrl();
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
        
		$scope.createuser = function() {
			Upload.upload({
				url: '/users', 
				method: 'POST', 
				headers: {'Content-Type': 'multipart/form-data'},
				fields: {credentials: $scope.credentials,
					activeImg: $stateParams.activePic},
				file: Upload.dataUrltoBlob($scope.url)               
			}).success(function (response, status) {
				// And redirect to the roster page
				$location.path('/users');
			}).error(function (err) {
				$scope.error = err.message;
			});
		};
	}
]);