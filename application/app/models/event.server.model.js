'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	moment = require('moment'),
	map = {
//		PERSONAL: require('../../app/controllers/events/Personal'),
//		NONPERSONAL: require('../../app/controllers/events/Nonpersonal')
//	};
		FIXED: require('../../app/controllers/eventFilters/Fixed'),
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
//    classType: {
//    	type: String,
//    	enum: Object.keys(map),
//    	required: 'Invalid Event class type'
//    },
    length: {
    	type: Number,
    	required: 'Please provide an Event length'
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    proj: {
        type: Schema.ObjectId,
        ref: 'Project'
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
    		default: 'FIXED'
    	},
    	params: {}
    }],
    possDates: [{
		start: Date,
		end: Date,
		priority: Number
    }]
});

//EventSchema.statics.create = function(event, params) {
//	map[event.classType].create.call(initEvent, event, params);
//}
//
//EventSchema.methods.create = function(params) {
//	return map[this.classType].create.call(this, params);
//}
//
//EventSchema.methods.list = function(params) {
//	return map[this.classType].list.call(this, params);
//}

EventSchema.methods.possFilter = function (filter) {
    return map[filter.type].execute.call(this, filter);
};

EventSchema.methods.recurUnrollNext = function(startDate, endDate) {
	var unrolled = [];
	if(this.status == 'personal') {
		if(moment(this.sched.start).isBefore(endDate) && moment(this.sched.end).isAfter(startDate)) {
			var curDate = moment(startDate).startOf('day');
			var eDate = moment(endDate).endOf('day');
			var unrollInst = persMap[this.recurring.type].next.call(this, new Date(parseInt(curDate.format('x'))));
			while(eDate.isAfter(unrollInst.sched.start) && curDate.isBefore(this.sched.end)) {
					unrolled.push(unrollInst);
					curDate = moment(unrollInst.sched.start).add(1, 'day').startOf('day');
					unrollInst = persMap[this.recurring.type].next.call(this, new Date(parseInt(curDate.format('x'))));
			}
		}
	} else {
		unrolled.push(this);
	}
	return unrolled;
};

EventSchema.methods.recurUnrollPrev = function(recur, startDate, endDate) {
	//return persMap[recur.type].past.call(recur, date);
	return null;
};

mongoose.model('Event', EventSchema);