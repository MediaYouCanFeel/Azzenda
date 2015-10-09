'use strict';

/**
 * Module dependencies.
 */

/**
 * Get the next instance of the recurring this after curDate
 */
exports.next = function(curDate) {
	console.log(curDate);
	var monthDate = moment(this.sched.start.getTime());
	var monthDay = moment(monthDate).date();
	var curDate = moment(curDate.getTime());
	var curMonth = moment(curDate.getTime()).month();
	var i=0;
	var nextDate;
	do {
		nextDate = moment(monthDate).add(i, 'month');
	} while(nextDate.date() != monthDay || nextDate.isBefore(curDate))
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
		}
	}
};

exports.past = function(curDate) {
	return this;
};