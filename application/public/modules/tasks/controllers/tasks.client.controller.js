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
        
      //Open Modal window for updating status of a Task
        $scope.updateTaskStatus = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/tasks/views/update-status.client.view.html',
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
				owners: {
					users: this.user_owner,
					teams: this.team_owner					
				},
				workers: {
					users: this.user_assigned, 
					teams: this.team_assigned
				},
				project: this.project,
				deadline: this.deadline,
				description: this.description,
				parTask: null
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
		
		// Create new Subtask
		$scope.createSubtask = function() {
			// Create new Task object
			var task = new Tasks ({
				name: this.name,
				owners: {
					users: this.user_owner,
					teams: this.team_owner					
				},
				workers: {
					users: this.user_assigned, 
					teams: this.team_assigned
				},
				deadline: this.deadline,
				description: this.description,
				parTask: $stateParams.taskId
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

		$scope.updateParTask = function() {
			$scope.parentTask = $scope.task._id;
		}
		
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
			}, $scope.initStuff);
		};
		
		$scope.initStuff = function() {
			$scope.updateStatus();
		}
		
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
        
        // Filters
        $scope.projectFilter = function(element) {
        	var filter = true;
        	if (element.project._id != $scope.project) {
        		filter = false;
        	} 
        	return filter;
        }
        
        $scope.notOwnerUsers = function(element) {
        	var filter = true;
        	if (($scope.user_owner) && (-1 != $scope.user_owner.indexOf(element._id))) {
        		filter = false;
        	}
        	return filter;
        }

        $scope.notOwnerTeam = function(element) {
        	var filter = true;
        	if (element._id == $scope.team_owner) {
        		filter = false;
        	} 
        	return filter;
        }

        $scope.notWorkerUsers = function(element) {
        	var filter = true;
        	if (($scope.user_assigned) && (-1 != $scope.user_assigned.indexOf(element._id))) {
        		filter = false;
        	}
        	return filter;
        }
        
        $scope.notWorkerTeam = function(element) {
        	var filter = true;
        	if (element._id == $scope.team_assigned) {
        		filter = false;
        	} 
        	return filter;
        }
        
        // DATEPICKER CONFIG
        $scope.datepickers = {
            earliest: false,
            latest: false
        };
        
        $scope.today = function() {
            $scope.dt = new Date();
        };
        
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        
        $scope.toggleMin();
        
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
        
        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened1 = true;
        };

        $scope.openWhich = function($event, which) {
            $event.preventDefault();
            $event.stopPropagation();

            for(var datepicker in $scope.datepickers)
            {
                datepicker = false;
            }
            $scope.datepickers[which]= true;
        };

        
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            showWeeks: false
         };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[3];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
              {
                date: tomorrow,
                status: 'full'
              },
              {
                date: afterTomorrow,
                status: 'partially'
              }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                  return $scope.events[i].status;
                }
              }
            }

            return '';
          };
          
          //Progress Bar
          $scope.max = 100;

          
          $scope.random = function() {
            var value = Math.floor((Math.random() * 100) + 1);
            var type;

            if (value < 25) {
              type = 'success';
            } else if (value < 50) {
              type = 'info';
            } else if (value < 75) {
              type = 'warning';
            } else {
              type = 'danger';
            }

            $scope.showWarning = (type === 'danger' || type === 'warning');

            $scope.dynamic = value;
            $scope.type = type;
          };
          //$scope.random();

          $scope.randomStacked = function() {
            $scope.stacked = [];
            var types = ['success', 'info', 'warning', 'danger'];

            for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
                var index = Math.floor((Math.random() * 4));
                $scope.stacked.push({
                  value: Math.floor((Math.random() * 30) + 1),
                  type: types[index]
                });
            }
          };
          $scope.randomStacked();
          
          $scope.displayStatus;
          
          $scope.updateStatus = function() {
        	  console.log("STATUS TEST: " + $scope.task.status);
        	  switch($scope.task.status) {
        	  	case "not started":
        	  		$scope.displayStatus = "Not Started";
        	  		$scope.dynamic = 0;
        	  		$scope.type = "warning";
        	  		break;
        	  	case "in progress":
        	  		$scope.displayStatus = "In Progress";
        	  		$scope.dynamic = 50;
        	  		$scope.type = "info";
        	  		break;
        	  	case "finished":
        	  		$scope.displayStatus = "Finished";
        	  		$scope.dynamic = 100;
        	  		$scope.type = "success";
        	  		break;
        	  	case "blocked":
        	  		$scope.displayStatus = "Blocked";
        	  		$scope.dynamic = 50;
        	  		$scope.type = "danger";
        	  		break;
        	  }        	  
          }
          
          $scope.sendUpateStatus = function(status) {
  			$scope.task = Tasks.update({
  					_id: $stateParams.taskId,
  					status: status
  			});
  		};
  		
  		$scope.getValue = function(status) {
  			switch(status) {
	     	  	case "not started":
	     	  		return 0;
	     	  	case "in progress":
	     	  		return 50;
	     	  	case "finished":
	     	  		return 100;
	     	  	case "blocked":
	     	  		return 50;
	     	}        	  
  		}
        
	}
]);