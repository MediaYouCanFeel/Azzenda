'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', 'Projects', 'Users', 'Teams', '$location', 'Authentication', 'Tasks',
	function($scope, $stateParams, Projects, Users, Teams, $location, Authentication, Tasks) {
		$scope.authentication = Authentication;

		//dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
		
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
]);