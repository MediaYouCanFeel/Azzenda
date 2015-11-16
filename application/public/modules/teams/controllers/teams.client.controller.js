'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams', 'Users', 'Projects', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Teams, Users, Projects, $modal, $log) {
		$scope.authentication = Authentication;
        
		angular.element('select').select2({ 
            width: '100%'
        });
		
		$scope.usersForSearch = [];
		
        //Open Modal window for creating events
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/teams/views/create-team.client.view.html',
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
        
        
        $scope.createForProjectModal = function (size) {
        	var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/teams/views/create-team-proj.client.view.html',
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
        
        $scope.wholeTeam = function (size) {
        	var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/teams/views/rest-names.client.view.html',
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
        
		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				project: this.project,
				description: this.description,
				users: this.members
			});

			// Redirect after save
			team.$save(function(response) {
				$location.path('teams/' + response._id);

                $scope.ok();
                
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Team for current Project
		$scope.createProjTeam = function() {
			
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				project: $stateParams.projectId,
				description: this.description,
				users: this.members
			});

			// Redirect after save
			team.$save(function(response) {
				$location.path('teams/' + response._id);

                $scope.ok();
                
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		
		// Remove existing Team
		$scope.remove = function(team) {
			if ( team ) { 
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams [i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			} else {
				$scope.team.$remove(function() {
					$location.path('teams');
				});
			}
		};

		// Update existing Team
		$scope.update = function() {
			var team = $scope.team;

			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();
		};

		// Find existing Team
		$scope.findOne = function() {
			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});
		};
		
		//Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            console.log(response);
            $scope.users = response;
            console.log($scope.users);
        };
        
        //Find a list of Projects
        //NOTE: This returns a list of all active (non-archived) projects
        $scope.findProjects = function() {
        	var response = Projects.query();
        	$scope.projects = response;
        };
        
        $scope.setDynamicPopover = function() {
			
        	$scope.dynamicPopover = "";
			
        	for (var i = 3; i < $scope.team.users.length; i++) {
        		$scope.dynamicPopover += $scope.team.users[i].displayName + "\n";
        	}
        }
        
        $scope.getString = function(number) {
        	return ("+" + number);
        }
        
        
        //FILTERS
        $scope.userSearch = function(element) {
        	if ($scope.usersForSearch.length > 0) {
        	
				for (var j = 0; j < $scope.usersForSearch.length; j++) {
					if (!$scope.checkMembership($scope.usersForSearch[j], element)) {
						return false;
					}
				}

				return true;
				
        	} else {
        		
        		//Search box is empty
        		return true;
        		
        	}
        	
        }
        
        $scope.searchNameText = function(element) {
			if ($scope.nameSearchText == "" || !$scope.nameSearchText) {
				return true;
			} else if (element.name.toLowerCase().contains($scope.nameSearchText.toLowerCase())){
				return true;
			} else {
				return false;
			}
		}
        
        $scope.searchProject = function(element) {
        	if (!$scope.projectForSearch || element.project._id == $scope.projectForSearch) {
        		return true;
        	} else {
        		return false;
        	}
        }
        
        $scope.checkMembership = function(userId, team) {
        	for (var i = 0; i < team.users.length; i++) {
        		//If user is found on the team, we're good
        		if (team.users[i]._id == userId) {
        			return "notFalse";
        		}
        	}
        	
        	//A user was not found on a team, stop
        	return false;
        }
        
        $scope.setThreads = function() {
        	console.log("$scope.team.threads: " + $scope.team.threads);
        	$stateParams.threads = [];
        }
	}
]);