'use strict';

/**
 * Module dependencies.
 */

/**
 * Get the next instance of the recurring this after curDate
 */
exports.next = function(curDate) {
	return {
			_id: this._id,
			name: this.name,
			created: this.created,
			owner: this.owner,
			length: this.length,
			sched: {
				start: this.sched.start,
				end: this.sched.start + this.length
			},
			recurring: this.recurring,
			status: this.status
	};
};

exports.past = function(recur, curDate) {
	return {
		_id: this._id,
		name: this.name,
		created: this.created,
		owner: this.owner,
		length: this.length,
		sched: {
			start: this.sched.start,
			end: this.sched.start + this.length
		},
		recurring: this.recurring,
		status: this.status
	};
};