'use strict';

/**
 * Module dependencies.
 */
var moment = require('moment');

/**
 * Apply filter
 */
exports.execute = function(filter) {
	var startDate = moment();
	var endDate = moment(startDate);
	var days = filter.params.days;
	startDate.startOf('day');
	endDate.endOf('day');
	
	var oldPossibleDates = this.possibleDates;
	for(i=0; i<oldPossibleDates.length; i++) {
		while(days.indexOf(startDate.day()) == -1) {
			startDate.add(1, 'day');
			endDate.add(1, 'day');
		}
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
		} else {
			oldPossibleDates.splice(i,1);
		}
		startDate.add(1, 'day');
		endDate.add(1, 'day');
	}
	this.possibleDates = oldPossibleDates;
};