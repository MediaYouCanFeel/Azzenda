'use strict';

/**
 * Module dependencies.
 */

/**
 * Get the next instance of the recurring this after curDate
 */
exports.next = function(curDate) {
	var monthDay = moment(this.sched.start.getTime()).date();
	var curDay = moment(curDate.getTime()).date();
	var curMonth = moment(curDate.getTime()).month();
	var nextDate = moment(this.sched.start.getTime());
	//if(curDate)
	var moment(curDate).date(moment(this.sched.start.getTime()).date())
};

exports.past = function(curDate) {
	return this;
};