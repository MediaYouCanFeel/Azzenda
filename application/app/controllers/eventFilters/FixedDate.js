'use strict';

/**
 * Module dependencies.
 */
var moment = require('moment');

/**
 * Apply filter
 */
exports.execute = function(filter) {
	var startDate = moment(filter.params.start).startOf('day').set({'second': 0, 'millisecond': 0});
	var endDate = moment(filter.params.start).endOf('day').add(this.length, 'ms').set({'second': 0, 'millisecond': 0});
	var oldPossibleDates = this.possDates;
	var i;
	for(i=0; i<oldPossibleDates.length; i++) {
		var dateRangeStart = moment(oldPossibleDates[i].start).set({'second': 0, 'millisecond': 0});
		var dateRangeEnd = moment(oldPossibleDates[i].end).set({'second': 0, 'millisecond': 0});
		if(startDate.isBefore(dateRangeEnd)) {
			if(endDate.isBefore(dateRangeStart) || moment(endDate).isSame(moment(dateRangeStart))) {
				oldPossibleDates.splice(i,1);
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
			i--;
		}
	}
	this.possDates = oldPossibleDates;
};