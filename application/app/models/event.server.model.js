'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	map = {
		FIXED: require('../../app/controllers/eventFilters/FixedDate'),
		TIMERANGE: require('../../app/controllers/eventFilters/TimeRange'),
		DAYOFWEEK: require('../../app/controllers/eventFilters/DayOfWeek')
	},
	persMap = {
		NONE: require('../../app/controllers/eventRecurring/None')//,
		//WEEKLY: require('../../app/controllers/eventRecurring/Weekly'),
		//MONTHLY: require('../../app/controllers/eventRecurring/Monthly')
	};

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter Event name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
    },
    desc: {
        type: String,
        default: '',
        required: 'Please enter a description of the event',
        trim: true
    },
    proj: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    length: {
    	type: Number,
    	required: 'Please provide an Event length'
    },
    sched: {
        start: {
            type: Date
        },
        end: {
            type: Date
        }
    },
    recurring: {
    	type: {
    		type: String,
    		enum: Object.keys(map),
    		required: 'Invalid personal event type'
    	},
    	params: {}
    	/*
    	 	num: Number,
	    	days: [{
	    		type: Number
	    	}]
    	*/
    },
    location: {
        type: Schema.ObjectId,
        ref: 'Location'
    },
    type: {
        type: Schema.ObjectId,
        ref: 'EventType'
    },
    guests: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['invited','going','not going']
        }/*,
        group: {
        	type: Schema.ObjectId,
        	ref: 'Group',
    	}*/	
    }],
    status: {
        type: String,
        enum: ['pending','scheduled','canceled','unschedulable','personal'],
    	default: 'pending'
    },
    filters: [{
    	type: {
    		type: String,
    		enum: Object.keys(map),
    		required: 'Invalid Event Filter type' 
    	},
    	params: {}
    }],
    possDates: [{
		start: Date,
		end: Date,
		priority: Number
    }]
});

EventSchema.methods.possFilter = function (filter) {
    return map[filter.type].execute.call(this, filter);
};

EventSchema.methods.recurUnrollNext = function(startDate, endDate) {
	if(this.personal && !moment(this.sched.start).isAfter(endDate) && !moment(this.sched.end).isBefore(startDate)) {
		var curDate = moment(startDate).startOf('day');
		var eDate = moment(endDate).endOf('day');
		var unrolled = [];
		var unrollInst = persMap[this.recurring.type].next.call(this, Date(parseInt(curDate.format('x'))));
		while(eDate.isAfter(unrollInst.sched.start) && eDate.isAfter(curDate)) {
				unrolled.push(unrollInst);
				curDate.add(1, 'day');
				unrollInst = persMap[this.recurring.type].next.call(this, Date(parseInt(curDate.format('x'))));
		}
		return unrolled;
	} else {
		return null;
	}
};

EventSchema.methods.recurUnrollPrev = function(recur, startDate, endDate) {
	//return persMap[recur.type].past.call(recur, date);
	return null;
};

mongoose.model('Event', EventSchema);