'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Events, $modal, $log) {
		$scope.authentication = Authentication;
        
        $scope.events = Events.query();
        console.log($scope.events);
        
        //Open Modal window for creating events
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-event.client.view.html',
              controller: function ($scope, $modalInstance, items) {
                  $scope.eventTypes = Events.getTypes();
                  
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
            
            modalInstance.result.then(function (selectedEvent) {
              $scope.selected = selectedEvent;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //Open Modal window for picking Date/Time
        $scope.createDateTimeModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/calendar-modal-event.client.view.html',
              controller: function ($scope, $modalInstance, items) {

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
            
            modalInstance.result.then(function (selectedEvent) {
              $scope.selected = selectedEvent;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        
		// Create new Event
		$scope.create = function() {
			// Create new Event object
			var event = new Events ({
                name: this.name,
                description: this.description,
				requestedDateTimeRange: {
                    dateTimes: [{
                        start: new Date(),
                        //if left empty, endDate will either be calculated using length
                        //if fixed, or endDate will be assumed to be midnight on startDate
                        end: new Date(),
                        //type: dateTime,date,time
                        //scheduler interpretation: fixed,range,exception
                        parameters: ['dateTime','fixed']
                    }],
                    //miliseconds
                    length: 1000000
                },
                location: this.location,
                type: this.type,
                //project: this.project
                scheduleParameters: ['']
			});
            
            //$scope.ok();
            
			// Redirect after save
			event.$save(function(response) {
				$location.path('events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event
		$scope.remove = function(event) {
			if ( event ) {
            //remove requested event, probably from event list view
				event.$remove();
                
                //remove the deleted event from $scope.events
				for (var i in $scope.events) {
					if ($scope.events [i] === event) {
						$scope.events.splice(i, 1);
					}
				}
			} else {
            //remove $scope.event, from single event view
				$scope.event.$remove(function() {
                    //return to event list view
					$location.path('events');
				});
			}
		};

		// Update existing Event
		$scope.update = function() {
            //get modified event from $scope
			var event = $scope.event;

			event.$update(function() {
                //return to single event view
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Events
		$scope.find = function() {
            var response = Events.query();
            console.log(response);
            $scope.events = response.events;
            console.log($scope.events);
		};

		// Find existing Event
		$scope.findOne = function() {
            //find event with id $stateParams.eventId, then set $scope.event to it
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
		};
        
        $scope.getTypes = function() {
            $scope.eventTypes = Events.getTypes();
        };
	        
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
            startingDay: 1,
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
    
        //TIMEPICKER OPTIONS
        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.changed = function () {
            $log.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };    
        
        //Combining Date & Time fields
        $scope.combineDateTimes = function(dateFromModal,
                                           timeFromModal,
                                           earliestDateFromModal,
                                           earliestTimeFromModal,
                                           latestDateFromModal,
                                           latestTimeFromModal) {
            if (dateFromModal)
            {
                dateFromModal.setHours($scope.timeFromModal.getHours());
                dateFromModal.setMinutes($scope.timeFromModal.getMinutes());
            } else if (earliestDateFromModal) {
                earliestDateFromModal.setHours($scope.earliestTimeFromModal.getHours());
                earliestDateFromModal.setMinutes($scope.earliestTimeFromModal.getMinutes()); 
                latestDateFromModal.setHours($scope.latestTimeFromModal.getHours());
                latestDateFromModal.setMinutes($scope.latestTimeFromModal.getMinutes());
            }
            
        };
        
    }
]);
