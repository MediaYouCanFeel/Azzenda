'use strict';

/**
 * Module dependencies.
 */
var moment = require('moment');

/**
 * Get the next instance of the recurring this after curDate
 */
exports.next = function(curDate) {
	var weekDays = this.recurring.params.days;
	var monthDate = moment(this.sched.start.getTime());
	var curDate = moment(curDate);
	var nextDate = moment(curDate).set({'hour': monthDate.hour(), 'minute': monthDate.minute(), 'second': 0});
	while(weekDays.indexOf(nextDate.day()) == -1 || nextDate.isBefore(curDate)) {
		nextDate.add(1, 'day');
	}
	var nDate = parseInt(nextDate.format('x'));
	return {
		_id: this._id,
		name: this.name,
		created: this.created,
		owner: this.owner,
		length: this.length,
		sched: {
			start: new Date(nDate),
			end: new Date(nDate + this.length)
		},
		status: this.status
	}
};