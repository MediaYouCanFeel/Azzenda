'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', 'Projects', 'Users', 'Groups', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Events, Projects, Users, Groups, $modal, $log) {
        
        $scope.authentication = Authentication;
        
        $scope.events = Events.query();
        //console.log($scope.events);
        
        $scope.eventTypes = Events.getTypes();
        
        //dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
        
        //spinner init
//        angular.element('spinner').spinner({
//        	incremental: false
//        });
        
        $scope.initModal = function() {
            var input = /** @type {HTMLInputElement} */(document.getElementById('location'));
            console.log(input);
            var autocomplete = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                $scope.place = autocomplete.getPlace();
                console.log($scope.place);
            });
        };
        
        //Open Modal window for creating events
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-event.client.view.html',
              controller: function ($scope, $modalInstance, items) {
                  console.log('In Modal Controller');
                  $scope.eventTypes = Events.getTypes();
                                  
                  $scope.ok = function () {
                    modalInstance.close();
                  };

                  $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                  };
              },
              size: size,
              resolve: {
                items: function () {}
              }
            });
            
            modalInstance.result.then(function (selectedEvent) {
              $scope.selected = selectedEvent;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.createTypeModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-event-type.client.view.html',
              controller: function ($scope, $modalInstance, items) {
                  console.log('In Modal Controller');
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
            
            //modalInstance.opened.then($scope.initModal);
            
            modalInstance.result.then(function (selectedEvent) {
              $scope.selected = selectedEvent;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //Create Event Type
        $scope.createEventType = function() {
        
        };
        
		// Create new Event
		$scope.create = function() {
            //Check for date mode
            var dateTimeMode = "not set";
            
            if (this.fixedDate == true) {
                dateTimeMode = "fixed";
            } else {
                dateTimeMode = "range";
            }
            
			// Create new Event object
            console.log(this.type);
			var event = new Events ({
                name: this.name,
                desc: this.description,
                //this needs to be in milliseconds
                length: parseInt(3600000),
                location: this.location,
                type: this.type,
                proj: this.project,
                filters: [{
                	type: 'FIXED',
                	params: {
                		//This needs to be in milliseconds
                		start: parseInt($scope.sendDate)
                	}
                }]
			});
            
            
            
			// Redirect after save
			event.$save(function(response) {
				$location.path('events/' + response._id);

				// Clear form fields
				$scope.name = '';
				
				$scope.ok();
				
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
        
        //Find a list of Projects
        //NOTE: This returns a list of all active (non-archived) projects
        $scope.findProjects = function() {
            var response = Projects.query();
            console.log(response);
            $scope.projects = response;
            console.log($scope.projects);
        };
        
        //Find a list of Groups
        $scope.findGroups = function() {
            //For getting list of all needed group numbers
            $scope.groupValues = [];
            $scope.groups = Groups.query();
        }
        
        $scope.findGroup = function(groupId) {
            return Groups.get({
				groupId: groupId
			});
        }
        
        //Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            console.log(response);
            $scope.users = response;
            console.log($scope.users);
        };
        
        //Find a list of Event Types
        $scope.findEventTypes = function() {
            var response = Events.getTypes();
            $scope.eventTypes = response;
        };
        
        //Find a list of Event Locations
        $scope.findEventLocs = function() {
            var response = Events.getLocs();
        	$scope.eventLocs = response;
        };
        
        $scope.createEventType = function(type) {
            Events.addType({
                name: type
            });
            $scope.ok();
        };
        
		//Find a list of all Events
		$scope.find = function() {
            var response = Events.query();
            $scope.events = response;
		};
		
		//Find a list of all future Events
		$scope.findFutureEvents = function() {
            var response = Events.query();
            $scope.futureEvents = response;
		};
		
		//Find a list of all past Events
		$scope.findPastEvents = function() {
            var response = Events.getPastEvents();
            $scope.pastEvents = response;
		};

		// Find existing Event
		$scope.findOne = function() {
            //find event with id $stateParams.eventId, then set $scope.event to it
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
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
    
        //TIMEPICKER OPTIONS
        $scope.mytime = new Date();
        
        $scope.timeFromModal = new Date();
        $scope.timeFromModal.setMinutes(0);
        $scope.oldTimeFromModal = $scope.timeFromModal;
        
        $scope.firstCall = new Date();
        
        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };
        
        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.timeFromModal = d;
        };

        $scope.changed = function () {
        	if ((new Date() - $scope.firstCall) <= 40) {
        		$scope.timeFromModal = $scope.oldTimeFromModal;
        	} else {
        		$scope.oldTimeFromModal = $scope.timeFromModal;
        		$scope.firstCall = new Date();
                $log.log('Time changed to: ' + $scope.timeFromModal);
        	}
        };

        $scope.timepickerClear = function() {
            $scope.timeFromModal = null;
        };    
        
        $scope.sendDate = moment();
        
        //Combining Date & Time fields
        $scope.combineDateTimes = function(dateFromModal,
                                           timeFromModal) {
//                                           earliestDateFromModal,
//                                           earliestTimeFromModal,
//                                           latestDateFromModal,
//                                           latestTimeFromModal) {
//            if (dateFromModal)
//            {
                dateFromModal.setHours($scope.timeFromModal.getHours());
                dateFromModal.setMinutes($scope.timeFromModal.getMinutes());
                $scope.sendDate = moment(dateFromModal).format('x');
//            } else if (earliestDateFromModal) {
//                earliestDateFromModal.setHours($scope.earliestTimeFromModal.getHours());
//                earliestDateFromModal.setMinutes($scope.earliestTimeFromModal.getMinutes()); 
//                latestDateFromModal.setHours($scope.latestTimeFromModal.getHours());
//                latestDateFromModal.setMinutes($scope.latestTimeFromModal.getMinutes());
//            }
            
        };    
        
        $scope.setCurrDate = function() {
        	$scope.currDate = moment().format();
        }
        //moment
        $scope.readableDate = function(dateTime) {
            
            //Default
            $scope.printDateDate = moment(dateTime).format('dddd, MMMM Do');
            
            var rightNow = moment();
            
            //If the event is happening today
            if (moment(dateTime).get('date') == moment(rightNow).get('date')) {
                $scope.printDateDate = 'Today at ';
            } else if(moment(dateTime).subtract(1, 'days').get('date') == moment(rightNow).get('date')) {
            	$scope.printDateDate = 'Tomorrow at ';
            } else if (moment(dateTime).subtract(7, 'days') < moment()) {
                //If the event is less than 7 days away
                $scope.printDateDate = moment(dateTime).format('dddd [at] ');   
            } else {
                //More than a week away
                $scope.printDateDate = moment(dateTime).format('MM/DD/YY [at] ');
            }
           
            $scope.printDateTime = moment(dateTime).format('h:mm A');
            
            $scope.printDate = $scope.printDateDate + $scope.printDateTime;
        }
        
        
        $scope.readableDateFull = function(dateTime) {
            
            //Default
            $scope.printDate = moment(dateTime).format('dddd, MMMM Do [at] h:mm A');
        }

        //Number picker
        $scope.input = {num: 2};

        $scope.getNumber = function() {
            alert('The number is: [' + $scope.input.num + ']');
        };

        $scope.onChange = function() {
            console.log('number changed', $scope.input.num);
        };
        
    }
]);
