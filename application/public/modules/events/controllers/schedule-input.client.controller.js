'use strict';

angular.module('events').controller('ScheduleInputController', ['$scope', '$stateParams', 'Authentication',
	function($scope, $stateParams, Authentication) {
	
	$scope.authentication = Authentication
	
	// Create new Event
	$scope.create = function() {
        
		var availSun = [this.su12_1a, 
		                this.su1_2a,
		                this.su2_3a,
		                this.su3_4a,
		                this.su4_5a,
		                this.su5_6a,
		                this.su6_7a,
		                this.su7_8a,
		                this.su8_9a,
		                this.su9_10a,
		                this.su10_11a,
		                this.su11_12p,
		                this.su12_1p,
		                this.su1_2p,
		                this.su2_3p,
		                this.su3_4p,
		                this.su4_5p,
		                this.su5_6p,
		                this.su6_7p,
		                this.su7_8p,
		                this.su8_9p,
		                this.su9_10p,
		                this.su10_11p,
		                this.su11_12a];
		
		var availMon = availSun;
		var availTue = availSun;
		var availWed = availSun;
		var availThu = availSun;
		var availFri = availSun;
		var availSat = availSun;
		
		$scope.availWeek = [availSun, 
		                    availMon, 
		                    availTue, 
		                    availWed, 
		                    availThu, 
		                    availFri, 
		                    availSat];
		
		for (var availDay in $scope.availWeek) {
			for(var time in availDay) {
				time = !time;
			}
		}      
        
		// Update sched & redirect
		($scope.authentication.user).updateSched($scope.availWeek, function(response) {
			$location.path('events/');		
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};
	}
]);