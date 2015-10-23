'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'Users', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Projects, Users, $modal, $log) {
		$scope.authentication = Authentication;

        //Projects.listArchived();
        
		//dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
		
        //Open Modal window for creating events
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/projects/views/create-project.client.view.html',
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
        
        
		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: this.name,
				owners: this.owners,
				type: this.type,
				description: this.description
			});

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);
                
				$scope.ok();
				
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};
		
		//Find a list of Archived Projects
		$scope.findArchived = function() {
			$scope.yourVariableHere = Projects.query({archived: true});
		};
		
		//Find a list of project types
		$scope.findTypes = function() {
			$scope.projectTypes = Projects.query({types: true});
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};
		
		// Find existing User
		$scope.findUser = function(userId) {
			$scope.user = Users.get({ 
				userId: userId
			});
		};
		
		//Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            $scope.users = response;
        };
        
        $scope.getTotalUsers = function(teams) {
        	var totUsers = 0;
        	
        	for (var i = 0; (i < teams.length) && teams[i]; i++) {
    			totUsers += teams[i].users.length;
        	}
        	return totUsers;
        }
	}
]);