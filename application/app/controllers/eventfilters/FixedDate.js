'use strict';

/**
 * Module dependencies.
 */

/**
 * Apply filter
 */
exports.execute = function(filter) {
	this.possibleDates = {
		start: filter.params.start,
		end: filter.params.start + this.length,
		priority: 0
	};
};