'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	map = {
			FIXED: require('../../app/controllers/eventFilters/FixedDate')
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
        enum: ['pending','scheduled','canceled','unschedulable']
    },
    filters: [{
    	type: {
    		type: String,
    		enum: Object.keys(map),
    		required: 'Invalid Event Filter type' 
    	},
    	params: {}
    }]/*,
    dateStack: [
        dat: {
        	type: Date
        }
    ]*/
});

EventSchema.methods.execute = function (filter) {
    return map[filter.type].execute.call(this, filter);
};

mongoose.model('Event', EventSchema);