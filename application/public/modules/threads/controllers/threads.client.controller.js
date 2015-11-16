'use strict';

// Threads controller
angular.module('threads').controller('ThreadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Threads', 'Teams', '$modal',
	function($scope, $stateParams, $location, Authentication, Threads, Teams, $modal) {
		$scope.authentication = Authentication;

		
		//Open Modal window for creating threads
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/threads/views/create-thread.client.view.html',
              controller: function ($scope, $modalInstance, items) {
                  console.log('In Modal Controller');
                                    
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
                }
              }
            });
            
            //modalInstance.opened.then($scope.initModal);
            
            modalInstance.result.then(function (selectedEvent) {
              $scope.selected = selectedEvent;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };
		
		
		// Create new Thread
		$scope.create = function() {
			// Create new Thread object
			var thread = new Threads ({
				text: this.text
			});

			// Redirect after save
			thread.$save(function(response) {
				//Send update to Project, Team, etc.
				
				console.log("response._id: " + response._id + "\n$stateParams.threads: " + $stateParams.threads);
				
				// Add this code here
				Teams.update({
						_id: $stateParams.teamId,
						threads: $stateParams.threads.concat(response._id)
				});
				
				
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Thread
		$scope.remove = function(thread) {
			if ( thread ) { 
				thread.$remove();

				for (var i in $scope.threads) {
					if ($scope.threads [i] === thread) {
						$scope.threads.splice(i, 1);
					}
				}
			} else {
				$scope.thread.$remove(function() {
					$location.path('threads');
				});
			}
		};

		// Update existing Thread
		$scope.update = function() {
			var thread = $scope.thread;

			thread.$update(function() {
				$location.path('threads/' + thread._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Threads
		$scope.find = function() {
			$scope.threads = Threads.query();
		};

		// Find existing Thread
		$scope.findOne = function() {
			$scope.thread = Threads.get({ 
				threadId: $stateParams.threadId
			});
		};
	}
]);