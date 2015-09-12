'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages', 'Users', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Messages, Users, $modal, $log) {
		$scope.authentication = Authentication;

		//dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
		
		//Open Modal window for reading conversations
		$scope.createModal = function (messageId) {
            
//			$scope.message = Messages.get({ 
//				messageId: '55ac6a6f82315db44227fbca'
//			});
//			
//			var message = $scope.message;
//			
//			console.log(message);
			
			$stateParams.messageId = messageId;
			
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/messages/views/view-message.client.view.html',
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
              scope: $scope,
              size: 'lg',
              resolve: {
                items: function () {
                  //return $scope.events;
                }
              }
            });
            
            //modalInstance.opened.then($scope.initModal);
            
            modalInstance.result.then(function () {
              
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };
		
		// Create new Message
		$scope.create = function() {
			var recip = this.recipients;
			console.log(recip);
			var userss = [];
			for(var i = 0; i < recip.length; i++) {
				console.log(recip[i]);
				userss.push({recipientType: 'User', recipient: recip[i]});
			}
			
			// Create new Message object
			var message = new Messages ({
				name: this.name,
				message: {
					content: this.content
				},
				recipients: userss
				//picturePath: this.picturePath
			});

			// Redirect after save
			message.$save(function(response) {
				$location.path('messages/' + response._id);

				// Clear form fields
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$location.path('messages');
				});
			}
		};

		// Update existing Message
		$scope.update = function() {
			var message = $scope.message;

			message.$update(function() {
				$location.path('messages/' + message._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		$scope.addMessage = function() {
			Messages.addMessage({
				messageId: $stateParams.messageId,
				message: "Your message here",
			});
		}

		// Find a list of Messages
		$scope.find = function() {
			$scope.messages = Messages.query();
		};

		// Find existing Message
		$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};
		
		//Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            console.log(response);
            $scope.users = response;
            console.log($scope.users);
        };
	}
]);