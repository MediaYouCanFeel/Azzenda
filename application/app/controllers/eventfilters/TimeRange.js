'use strict';

/**
 * Module dependencies.
 */
var moment = require('moment');

/**
 * Apply filter
 */
exports.execute = function(filter) {
	var startDate = moment(filter.params.start).set({'second':0,'millisecond':0});
	var endDate;
	if(filter.params.end - filter.params.start > 0) {
		endDate = moment(filter.params.end).set({'second':0,'millisecond':0});
	} else if(filter.params.end - filter.params.start < 0) {
		endDate = moment(filter.params.end).add(1, 'day').set({'second':0,'millisecond':0});
	} else {
		//throw error or something
	}
	console.log(startDate);
	console.log(endDate);
	
	var oldPossibleDates = this.possibleDates;
	var i;
	for(i=0; i<oldPossibleDates.length; i++) {
		var dateRangeStart = moment(oldPossibleDates[i].start);
		var dateRangeEnd = moment(oldPossibleDates[i].end);
		if(startDate.isBefore(dateRangeEnd)) {
			if(endDate.isBefore(dateRangeStart)) {
				i--;
			} else {
				if(startDate.isAfter(dateRangeStart)) {
					 oldPossibleDates[i].start = parseInt(startDate.format('x'));
				}
				if(endDate.isBefore(dateRangeEnd)) {
					var oldEndDate = oldPossibleDates[i].end;
					oldPossibleDates[i].end = parseInt(endDate.format('x'));
					oldPossibleDates.splice(i+1,0,{start: oldPossibleDates[i].end, end: oldEndDate});
				}
			}
			startDate.add(1, 'day');
			endDate.add(1, 'day');
		} else {
			oldPossibleDates.splice(i,1);
			i--;
		}
	}
	this.possibleDates = oldPossibleDates;
};