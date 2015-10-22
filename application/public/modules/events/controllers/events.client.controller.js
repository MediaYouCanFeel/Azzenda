'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$timeout', '$location', 'Authentication', 'Events', 'Projects', 'Users', 'Teams', '$modal', '$log',
	function($scope, $stateParams, $timeout, $location, Authentication, Events, Projects, Users, Teams, $modal, $log) {
        
        $scope.authentication = Authentication;
        
        $scope.events = Events.query();
        
        $scope.eventTypes = Events.getTypes();
        
        $scope.personal = false;
        
        $scope.showPers;
        
        $scope.sidebarDay = moment();
        
        //dropdown init
        angular.element('select').select2({ 
            width: '100%'
        });
                
        $scope.initModal = function() {
            var input = /** @type {HTMLInputElement} */(document.getElementById('location'));
        };
        
        //Open Modal window for creating events
        $scope.createModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-event.client.view.html',
              controller: function ($scope, $modalInstance, items) {
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
            }, function () {});
        };

        $scope.createTypeModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-event-type.client.view.html',
              controller: function ($scope, $modalInstance, items) {
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

        $scope.createPersModal = function (size) {
            
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/events/views/create-pers-event.client.view.html',
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
        };
        
        //Create Event Type
        $scope.createEventType = function() {
        
        };
        
		// Create new Event
		$scope.create = function() {
            
			var thisDesc = null;
			var thisLoc = null;
			var thisType = null;
			var thisProj = null;
			
			//For non-personal events
			if (!$scope.personal) {
				thisDesc = this.description;
				thisLoc = this.location;
				thisType = this.type;
				thisProj = this.project;
			}
			
			var recDays = null;
			
			console.log("BEFORE");
			$scope.combineDateTimes(this.dateFromModal, this.timeFromModal);
			console.log("AFTER");
			
			var thisSchedStart = $scope.sendDate; //Range start

			var thisSchedEnd = null;
			
			//if it is a recurring event
			if (($scope.recType != 'NONE') && $scope.recType) {
			
				thisSchedStart = this.dateFromModal;
				
				//for weekly recurrence
				if ($scope.recType == 'WEEKLY') {
					
					//Store days of week
					recDays = [];
					if (this.sun) {
						recDays.push(0);
					}
					if (this.mon) {
						recDays.push(1);
					}
					if (this.tue) {
						recDays.push(2);
					}
					if (this.wed) {
						recDays.push(3);
					}
					if (this.thu) {
						recDays.push(4);
					}
					if (this.fri) {
						recDays.push(5);
					}
					if (this.sat) {
						recDays.push(6);
					}		
				}
				
				//Range End DateTimes (in millis)
				$scope.combineDateTimes(this.recEndDate, this.timeFromModal);
				thisSchedEnd = $scope.sendDate; //Range end
			}
			
			var rec;
			
			if (!$scope.recType) {
				rec = "NONE";
			} else {
				rec = $scope.recType;
			}
			
			// Create new Event object
			var event = new Events ({
                name: this.name,
                desc: thisDesc,
                length: parseInt($scope.getLength(this.hourDurationFromModal, this.minDurationFromModal)),
                location: thisLoc,
                type: thisType,
                proj: thisProj,
                personal: $scope.personal,
                recurring: {
                	type: rec,
                	params: {
                		days: recDays
                	}
                },
                sched: {
                	start: thisSchedStart,
                	end: thisSchedEnd
                },
                guests: this.guests
			});
			
			//Add event filters
			event.filters = [];
			if (this.fixedFilter && !($scope.personal)) {
				if(this.trFilter) {
					event.filters.push({
						type: "FIXEDDATE",
						params: {
							start: parseInt($scope.sendDate)
						}
					});
				} else {
					event.filters.push({
						type: "FIXED",
						params: {
							start: parseInt($scope.sendDate)
						}
					});
				}
			};
			
			if (this.trFilter && !($scope.personal)) {
				$scope.setEarlyTime(this.timeFromModal);
				$scope.setLateTime(this.latestTimeFromModal);
				event.filters.push({
					type: "TIMERANGE",
					params: {
						start: parseInt($scope.earlyTime),
						end: parseInt($scope.lateTime)
					}
				});
			};
			
			if (this.dowFilter && !($scope.personal)) {
				var dayArray = [];
				if (this.sun) {
					dayArray.push(0);
				}
				if (this.mon) {
					dayArray.push(1);
				}
				if (this.tue) {
					dayArray.push(2);
				}
				if (this.wed) {
					dayArray.push(3);
				}
				if (this.thu) {
					dayArray.push(4);
				}
				if (this.fri) {
					dayArray.push(5);
				}
				if (this.sat) {
					dayArray.push(6);
				}

				event.filters.push({
					type: "DAYOFWEEK",
					params: {
						days: dayArray
					}
				});
			}
			
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
            $scope.projects = response;
        };
        
        //Find a list of Teams
        $scope.findTeams = function() {
            //For getting list of all needed team numbers
            $scope.teamValues = [];
            $scope.teams = Teams.query();
        }
        
        $scope.findTeam = function(teamId) {
            return Teams.get({
				teamId: teamId
			});
        }
        
        //Find a list of Users
        $scope.findUsers = function() {
            var response = Users.query();
            $scope.users = response;
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
		
		//Find a list of all Events in a range
		$scope.findEvents = function() {
            var response = Events.query({
            	startDate: new Date(moment().set('hours', 0).set('minutes',0)),
            	endDate: moment().add(1, 'week').format('x')
            });
            $scope.events = response;
		};
		
//		//Find a list of all past Events
//		$scope.findPastEvents = function() {
//            var response = Events.getPastEvents();
//            $scope.pastEvents = response;
//		};

		// Find existing Event
		$scope.findOne = function() {
            //find event with id $stateParams.eventId, then set $scope.event to it
			$scope.event = Events.get({
				eventId: $stateParams.eventId
			});
		};  
		
		// RSVP
		$scope.rsvp = function(status) {
			$scope.event = Events.rsvp({
					_id: $stateParams.eventId,
					going: status
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
        
        $scope.setEarlyTime = function(earlyTimeFromModal) {
        	$scope.earlyTime = moment().set('hours', moment(earlyTimeFromModal).get('hours'));
        	$scope.earlyTime.set('minutes', moment(earlyTimeFromModal).get('minutes'));
        	$scope.earlyTime = moment($scope.earlyTime).format('x');
        }
        
        $scope.setLateTime = function(lateTimeFromModal) {
        	$scope.lateTime = moment().set('hours', moment(lateTimeFromModal).get('hours'));
        	$scope.lateTime.set('minutes', moment(lateTimeFromModal).get('minutes'));
        	$scope.lateTime = moment($scope.lateTime).format('x');
        }
        
        $scope.sendDate = moment();
        
        //Combining Date & Time fields
        $scope.combineDateTimes = function(dateFromModal,
                                           timeFromModal) {
//            if (!dateFromModal) {
//            	console.log("DATEFROMMODAL NULL");
//            	dateFromModal = new Date();
//            }
        	dateFromModal.setHours(timeFromModal.getHours());
            dateFromModal.setMinutes(timeFromModal.getMinutes());
            $scope.sendDate = moment(dateFromModal).format('x');      
        };    
        
        $scope.setCurrDate = function() {
        	$scope.currDate = moment().format();
        }
        //moment
        $scope.readableDate = function(dateTime) {
            
            //Default
            $scope.printDateDate = moment(dateTime).format('dddd, MMMM Do');
            
            var rightNow = moment();
            
            var alreadyHappened = moment(dateTime) < moment(rightNow);
            
            //If the event is happening today           
        	if($scope.checkToday(moment(dateTime).add(1, 'days')) && alreadyHappened) {
	        	$scope.printDateDate = 'Yesterday at ';
	        } else if ($scope.checkToday(dateTime)) {
	            $scope.printDateDate = 'Today at ';
	        } else if (moment(dateTime).add(7, 'days') > moment(rightNow) && alreadyHappened) {
	            //If the event is less than 7 days away
	            $scope.printDateDate = moment(dateTime).format('[Last] dddd [at] ');   
	        } else if(moment(dateTime).subtract(1, 'days').get('date') == moment(rightNow).get('date')) {
	        	$scope.printDateDate = 'Tomorrow at ';
	        } else if (moment(dateTime).subtract(7, 'days') < moment(rightNow) && !alreadyHappened) {
	            //If the event is less than 7 days away
	            $scope.printDateDate = moment(dateTime).format('dddd [at] ');   
	        } else {
	            //More than a week away
	            $scope.printDateDate = moment(dateTime).format('MM/DD/YY [at] ');
	        }
           
            $scope.printDateTime = moment(dateTime).format('h:mm A');
            
            $scope.printDate = $scope.printDateDate + $scope.printDateTime;
        }
        
        $scope.checkToday = function(dateTime) {
        	var rightNow = moment();
        	var sameDay = (moment(dateTime).get('date') == moment(rightNow).get('date'));
        	var sameMonth = (moment(dateTime).get('month') == moment(rightNow).get('month'));
        	var sameYear = (moment(dateTime).get('year') == moment(rightNow).get('year'));
        	if(sameDay && sameMonth && sameYear) {
        		return true;
        	} 
        }
        
        $scope.checkSameDay = function(dateTime1, dateTime2) {
        	var sameDay = (moment(dateTime1).get('date') == moment(dateTime2).get('date'));
        	var sameMonth = (moment(dateTime1).get('month') == moment(dateTime2).get('month'));
        	var sameYear = (moment(dateTime1).get('year') == moment(dateTime2).get('year'));
        	if(sameDay && sameMonth && sameYear) {
        		return true;
        	} 
        }
        
        $scope.readableEndDate = function(dateTime, duration) {
        	
        	var rightNow = moment();
        	
        	var endDateTime = moment(dateTime).add(parseInt(duration), 'milliseconds');
        	var printEndDate;
        	duration = this.length;
        	
        	//Check if entirely contained within 1 calendar day
        	if (moment(dateTime).get('date') == moment(endDateTime).get('date')) {
        		printEndDate = moment(endDateTime).format('h:mm A');
        	} else {
        		printEndDate = moment(endDateTime).format('dddd, MMMM Do [at] h:mm A');
        	}
        	
        	$scope.printEndDate = " - " + printEndDate;
        	$scope.printFullDate = $scope.printDate + $scope.printEndDate;
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

        $scope.onChange = function() {};
        
        $scope.recMonthDay;
        
        $scope.updateMonthDay = function(dateFromModal) {
        	$scope.recMonthDay = moment(dateFromModal).get('date');
        };
        
        $scope.getRecMonthDay = function() {
        	if ($scope.recMonthDay) {
	        	var recMonthString = "Will repeat every " + $scope.recMonthDay;
	        	if ($scope.recMonthDay == 1 || $scope.recMonthDay == 21 || $scope.recMonthDay == 31) {
	        		recMonthString += "st ";
	        	} else if ($scope.recMonthDay == 2 || $scope.recMonthDay == 22) {
	        		recMonthString += "nd ";
	        	} else if ($scope.recMonthDay == 3 || $scope.recMonthDay == 23) {
	        		recMonthString += "rd ";
	        	} else {
	        		recMonthString += "th ";
	        	}
	        	recMonthString += "day of the month.";
	        	
	        	if ($scope.recMonthDay > 28) {
	        		recMonthString += " NOTE: Not every month will contain this event, since certain months have less than " + $scope.recMonthDay + " days.";
	        	}
	        	
        	} else {
        		var recMonthString = "Select a date to enable monthly recurrence.";
        	}
        	return recMonthString;
        }
        
        $scope.getLength = function(hours, mins) {
        	var tot = 0;
        	if (hours) {
        		tot += (hours * 3600000);
        	}
        	
        	if (mins) {
        		tot += (mins * 60000);
        	}
        	
        	return tot;
        }
        
        $scope.checkPersonalEvents = function(element) {
        	var filter = false;
        	if (element.status != 'personal') {
        		filter = true;
        	} else if ($scope.showPers) {
        		filter = true;
        	}
        	return filter;
        }
        
        
        $scope.thisUser = function(element) {
        	var filter = false;
        	if (element.user == $scope.authentication.user._id) {
        		filter = true;
        	}
        	
        	return filter;
        }
        
        $scope.getDateReadable = function(daysAway){
        	var ret = moment();
        	if (daysAway < 0) {
        		daysAway *= (-1);
        		ret = moment(ret).subtract(daysAway, 'days');
        	} else if (daysAway > 0) {
        		ret = moment(ret).add(daysAway, 'days');        		
        	}
        	
        	return moment(ret).format('dddd, MMMM DD, YYYY');
        }
        
        $scope.selDate;
        
        $scope.selDateMain;
        
        $scope.setDateReadable = function(daysAway){
        	var ret = moment();
        	if (daysAway < 0) {
        		daysAway *= (-1);
        		ret = moment(ret).subtract(daysAway, 'days');
        	} else if (daysAway > 0) {
        		ret = moment(ret).add(daysAway, 'days');        		
        	}
        	
        	return moment(ret).format('dddd, MMMM DD, YYYY');
        }
        
        $scope.setSelDateMain = function(offset) {
        	$scope.selDateMain =  $scope.setDateReadable(offset);
        }
        
        $scope.setSelDate = function(daysAway) {
        	var ret = moment();
        	if (daysAway < 0) {
        		daysAway *= (-1);
        		ret = moment(ret).subtract(daysAway, 'days');
        	} else if (daysAway > 0) {
        		ret = moment(ret).add(daysAway, 'days');        		
        	}
        	$scope.selDate = ret;
        }
        
        $scope.offset;
        $scope.sidebarDayIndex = 100;
        
        $scope.setSidebarDayIndex = function(ind) {
        	$scope.sidebarDayIndex = ind;
        }
        
        $scope.justThisDay = function(element) {
        	var filter = false;
        	$scope.sidebarDay = $scope.getDateReadable($scope.offset + $scope.sidebarDayIndex);
        	if ($scope.checkSameDay($scope.sidebarDay, element.sched.start)) {
        		filter = true;
        	}
         	return filter;
        }
        
        $scope.justThisDayFull = function(element) {
        	var filter = false;
        	$scope.fullEventsDate = $scope.getDateReadable($scope.offset + $scope.selectedIndex);
        	if ($scope.checkSameDay($scope.fullEventsDate, element.sched.start)) {
        		filter = true;
        	}
         	return filter;
        }
        
        $scope.setSidebarDay = function(dateTime) {
        	$scope.sidebarDay = moment(dateTime);
        }
        
        $scope.selDayArr;
        
        $scope.getNumber = function(num) {
            var ret = [];
            var i = 1;
            for (var ind = 0; ind < num; ind++) {
            	if (ind == 0) {
            		ret.push({sel: true});
            	} else {
            		ret.push({sel: false});
            	}
            	i++;
            }
            $scope.selDayArr = ret;
            return ret;   
        }
        
        $scope.getShortTime = function(dateTime) {
        	return moment(dateTime).format("hh:mm A");
        }
        
        $scope.getShortName = function(longName) {
        	return longName.trunc(25);
        }
        
        String.prototype.trunc = String.prototype.trunc ||
        function(n){
            return this.length>n ? this.substr(0,n-1)+'...' : this;
        };
        
        $scope.selectedIndex = 0;
        
        $scope.updateSelected = function(index) {
        	$scope.selDayArr[$scope.selectedIndex] = {sel: false};
        	$scope.selectedIndex = index;
           	$scope.selDayArr[$scope.selectedIndex] = {sel: true};
        }
        
        $scope.isSelected = function(index) {
        	return $scope.selDayArr[index].sel;
        }
        
        $scope.fullEventsDate;
        
        $scope.selIndex;
        
        $scope.refreshFilter = function() {
        	$timeout;
        }
        
        $scope.findEventsCustom = function(start) {
        	console.log("START: " + start); 
            
        	var changeRange = false;
        	
        	if (moment(start).format('x') < moment($scope.startRange).add(1, 'day').format('x')) {
        		$scope.startRange = new Date(moment(start).subtract(1, 'week'));
        		$scope.endRange = moment(start).add(2, 'week').format('x');
        		changeRange = true;
        	}
        	
        	console.log("NEW START: " + moment(start).add(2, 'week')._d + "\nOLD END: " + moment(parseInt($scope.endRange))._d)
        	
        	if ( moment(start).add(1, 'week').isAfter(moment(parseInt($scope.endRange))) ) {
        		console.log("HERE");
        		$scope.startRange = new Date(moment(start).subtract(1, 'week'));
        		$scope.endRange = moment(start).add(2, 'week').format('x');
            	changeRange = true;
        	}
        	
        	if (changeRange) {
	        	var response = Events.query({
	            	startDate: $scope.startRange,
	            	endDate: $scope.endRange
	            });
	            $scope.events = response;
        	}
		};
    }
]);
