'use strict';

// Threads controller
angular.module('threads').controller('ThreadsController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Threads', 'Teams', 'Projects', '$modal', '$log',
	function($scope, $stateParams, $state, $location, Authentication, Threads, Teams, Projects, $modal, $log) {
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
		
        //Open Modal window for replying to a thread
        $scope.reply = function (threadId, size) {
            
        	$stateParams.threadId = threadId;
        	
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/threads/views/create-sub-thread.client.view.html',
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
        
        $scope.createSub = function() {
        	console.log("parThread: " + $stateParams.threadId);
        	var thread = new Threads ({
				text: this.text,
				parThread: $stateParams.threadId
			});
        	
        	// Redirect after save
			thread.$save(function(response) {
				//Send update to Project, Team, etc.
				
				console.log("response._id: " + response._id + "\n$stateParams.threads: " + $stateParams.threads);
				
				$scope.ok();
				
				$state.go($state.current, {}, {reload: true});
				
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        }
        
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
				
				$scope.ok();
				
				// Add this code here
				if ($location.path().startsWith('/teams')) {
				    console.log("TEAMS THREAD");
					Teams.update({
							_id: $stateParams.teamId,
							thread: response._id
					}, function() {
						$state.go($state.current, {}, {reload: true});
					});
				}
			    
				if($location.path().startsWith('/projects')) {
					console.log("PROJECTS THREAD");
					Projects.update({
						_id: $stateParams.projectId,
						thread: response._id
					}, function() {
						$state.go($state.current, {}, {reload: true});
					});
				}
				
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
		
		//INTERACTIONS
		$scope.setInitVotes = function(threadId) {
			$scope.thread = Threads.get({ 
				threadId: threadId
			}, function() {
				$scope.threadUpVotes = $scope.thread.votes.up;
				$scope.threadDownVotes = $scope.thread.votes.down;
			});
		}
		
		$scope.upvote = function(threadId) {
			Threads.update({
				_id: threadId,
				upvote: true
			}, function(response) {
				$scope.thread = response;
			});
//			$scope.thread = Threads.get({ 
//				threadId: threadId
//			}, function() {
//				$scope.thread.votes.up++;
//				$scope.update();
//				$scope.threadUpVotes = $scope.thread.votes.up;
//
//			});
		}
		
		$scope.downvote = function(threadId) {
			Threads.update({
				_id: threadId,
				upvote: false
			}, function(response) {
				$scope.thread = response;
			});
//			$scope.thread = Threads.get({ 
//				threadId: threadId
//			}, function() {
//				$scope.thread.votes.down++;
//				$scope.update();
//				$scope.threadDownVotes = $scope.thread.votes.down;
//			});
		}
	}
]);