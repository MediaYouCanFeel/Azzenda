'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', 'Projects', 'Users', 'Teams', '$location', 'Authentication', 'Tasks', '$modal', '$log',
	function($scope, $stateParams, Projects, Users, Teams, $location, Authentication, Tasks, $modal, $log) {
		$scope.authentication = Authentication;

		//dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
			
        //Open Modal window for creating tasks
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/tasks/views/create-task.client.view.html',
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
                  //return $scope.events;
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
        
        //Open Modal window for creating subtasks
        $scope.createSubtaskModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/tasks/views/create-subtask.client.view.html',
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
                  //return $scope.events;
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
        
		// Create new Task
		$scope.create = function() {
			// Create new Task object
			var task = new Tasks ({
				name: this.name,
				owners: this.owners,
				workers: {
					users: this.user_assigned, 
					teams: this.team_assigned
				},
				project: this.project
			});

			// Redirect after save
			task.$save(function(response) {
				$location.path('tasks/' + response._id);

				$scope.ok();
				
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Task
		$scope.remove = function(task) {
			if ( task ) { 
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks [i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}
		};

		// Update existing Task
		$scope.update = function() {
			var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tasks
		$scope.find = function() {
			$scope.tasks = Tasks.query();
		};

		// Find existing Task
		$scope.findOne = function() {
			$scope.task = Tasks.get({ 
				taskId: $stateParams.taskId
			});
		};
		
		//Find a list of Projects
        $scope.findProjects = function() {
            var response = Projects.query();
            $scope.projects = response;
        };
        
        //Find a list of Teams
        $scope.findTeams = function() {
            var response = Teams.query();
            $scope.teams = response;
        };
        
        //Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            $scope.users= response;
        };
        
        $scope.projectFilter = function(element) {
        	var filter = true;
        	if (element.project._id != $scope.project) {
        		filter = false;
        	} 
        	return filter;
        }
	}
]).directive('toggle', function(){
  return {
	    restrict: 'A',
	    link: function(scope, element, attrs){
	      if (attrs.toggle=="tooltip"){
	        $(element).tooltip();
	      }
	      if (attrs.toggle=="popover"){
	        $(element).popover();
	      }
	    }
	  };
});