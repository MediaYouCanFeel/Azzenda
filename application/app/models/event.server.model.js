'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	moment = require('moment'),
	map = {
		FIXEDTIME: require('../../app/controllers/eventFilters/FixedTime'),
		FIXEDDATE: require('../../app/controllers/eventFilters/FixedDate'),
		TIMERANGE: require('../../app/controllers/eventFilters/TimeRange'),
		DAYOFWEEK: require('../../app/controllers/eventFilters/DayOfWeek')
	},
	persMap = {
		NONE: require('../../app/controllers/eventRecurring/None'),
		WEEKLY: require('../../app/controllers/eventRecurring/Weekly'),
		MONTHLY: require('../../app/controllers/eventRecurring/Monthly')
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
    length: {
    	type: Number,
    	required: 'Please provide an Event length'
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    //should probably remove this
    proj: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    sched: {
    	start: Date,
        end: Date
    },
    recurring: {
    	type: {
    		type: String,
    		enum: Object.keys(persMap),
    		default: 'NONE'
    	},
    	params: {}
    	/*
    	 	num: Number,
	    	days: [{
	    		type: Number
	    	}]
    	*/
    },
    location: String,
    type: String,
    priority: Number,
    guestStrategy: {
    	type: String,
		//automatic means algorithm will only
		//invite people who are available, and it will
		//only invite up to max people
		//First come first serve means all potential
		//guests will be invited. once max is hit,
		//all other guests who have not yet responded
		//will be removed
		enum: ['automatic', 'fcfs']
    },
    guestRequest: [{
    	group: {
    		type: Schema.ObjectId,
    		ref: String
    	},
    	//min determines how many guests to consider necessary
    	min: {
    		type: Number,
    		required: 'Please enter a min number of guests'
    	},
    	max: Number,
    	guests: [{
    		type: Schema.ObjectId,
    		ref: 'User'
    	}]
    }],	
    guests: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['invited','going','not going']
        },
        required: Boolean
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
    		default: 'FIXED'
    	},
    	params: {}
    }],
    possDates: [{
		start: Date,
		end: Date
    }]
});

EventSchema.methods.possFilter = function (filter) {
    return map[filter.type].execute.call(this, filter);
};

EventSchema.methods.recurUnrollNext = function(startDate, endDate) {
	var unrolled = [];
	if(moment(this.sched.start).isBefore(endDate) && moment(this.sched.end).isAfter(startDate)) {
		var curDate = moment.max(moment(startDate).startOf('day'),moment(this.sched.start).startOf('day'));
		var eDate = moment(endDate).endOf('day');
		var unrollInst = persMap[this.recurring.type].next.call(this, new Date(parseInt(curDate.format('x'))));
		while(eDate.isAfter(unrollInst.sched.start) && curDate.isBefore(this.sched.end)) {
			unrolled.push(unrollInst);
			curDate = moment(unrollInst.sched.end);
			unrollInst = persMap[this.recurring.type].next.call(this, new Date(parseInt(curDate.format('x'))));
			if(moment(unrollInst.sched.start).isAfter(this.sched.end)) {
				break;
			}
		}
	}
	return unrolled;
};

mongoose.model('Event', EventSchema);