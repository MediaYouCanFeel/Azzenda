'use strict';

angular.module('users').controller('CreateUsersController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Upload',
	function($scope, $http, $location, Users, Authentication, Upload) {
		$scope.authentication = Authentication;
        $scope.activePic = false;
        //dropdown init
//        angular.element('select').select2({ width: '100%' });
        
//        $scope.findRoles = function() {
//            $scope.roles = ['user','admin'];
//        };
		
		$scope.picSelected = function(files) {
			console.log('test');
			if(files && (files.length > 0)) {
				console.log('Pic selected');
				$scope.activePic = true;
			} else {
				console.log('No pic selected');
				$scope.activePic = false;
			}
		}

		$scope.createuser = function(dataUrl) {
			Upload.upload({
				url: '/users', 
				method: 'POST', 
				headers: {'Content-Type': 'multipart/form-data'},
				fields: {credentials: $scope.credentials,
					activeImg: $scope.activePic},
				file: Upload.dataUrltoBlob(dataUrl)               
			}).success(function (response, status) {
				// And redirect to the roster page
				$location.path('/users');
			}).error(function (err) {
				$scope.error = err.message;
			});
		};
	}
]);