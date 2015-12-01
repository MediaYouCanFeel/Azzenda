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
	var endDate = moment(filter.params.start).add(this.length, 'ms').set({'second':0,'millisecond':0});
	
	var oldPossibleDates = this.possDates;
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
	this.possDates = oldPossibleDates;
};