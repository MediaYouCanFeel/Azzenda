'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Upload',
	function($scope, $stateParams, $http, $location, Authentication, Upload) {
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
        
        $scope.doProfPicEndStuff = function(croppedDataUrl) {
        	console.log("croppedDataUrl: " + croppedDataUrl);
        	$scope.setUrl(croppedDataUrl); 
        	$scope.ok();
        	$scope.showProfPicUrl();
        }
        
        $scope.setUrl = function(croppedDataUrl) {
        	$stateParams.url = croppedDataUrl;
        }
        
        $scope.showProfPicUrl = function() {
        	$scope.url = $stateParams.url;
        }
        
		$scope.signup = function() {
			console.log("dataUrl: " + $stateParams.url);
			Upload.upload({
				url: '/auth/signup', 
				method: 'POST', 
				headers: {'Content-Type': 'multipart/form-data'},
				fields: {credentials: $scope.credentials,
					activeImg: $stateParams.activePic},
				file: Upload.dataUrltoBlob($stateParams.url)              
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