'use strict';

/**
 * Module dependencies.
 */

/**
 * Apply filter
 */
exports.execute = function(filter) {
    this.sched = {
    		start: filter.params.start,
    		end: filter.params.start + this.length
    };
};