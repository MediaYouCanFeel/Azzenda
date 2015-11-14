'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Upload',
	function($scope, $http, $location, Authentication, Upload) {
		$scope.authentication = Authentication;
		$scope.activePic = false;
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        //dropdown init
        angular.element('select').select2({ width: '100%' });
        
        $scope.picSelected = function(files) {
			if(files && (files.length > 0)) {
				console.log('Pic selected');
				$scope.activePic = true;
			} else {
				console.log('No pic selected');
				$scope.activePic = false;
			}
		}
        
		$scope.signup = function(dataUrl) {
			Upload.upload({
				url: '/auth/signup', 
				method: 'POST', 
				headers: {'Content-Type': 'multipart/form-data'},
				fields: {credentials: $scope.credentials,
					activeImg: $scope.activePic},
				file: Upload.dataUrltoBlob(dataUrl)              
			}).success(function (response, status) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				$scope.signin();
			}).error(function (err) {
				$scope.error = err.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/splashes');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);