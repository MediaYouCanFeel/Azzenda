'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
    },
    description: {
        type: String,
        default: '',
        required: 'Please enter a description of the event',
        trim: true,
    },
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    fixedDate: {
        type: Boolean,
        default: true,
        required: 'Please select \'Fixed\' or \'Range\''
    },
    scheduledDateTimeRange: {
        startDateTime: {
            type: Date
        },
        endDateTime: {
            type: Date
        },
        length: {
            type: String
        }
    },
    requestedDateTimeRange: {
        startDateTime: {
            type: Date
        },
        endDateTime: {
            type: Date
        },
        length: {
            type: String
        },
        parameters: [{
            type: String
        }]
    },
    location: {
        type: String,
        required: 'Please enter a location',
        trim: true
    },
    type: {
        type: String,
        required: 'Please select an existing type or create a new one',
        trim: true
    },
    guests: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: String
        }
    }]
});

mongoose.model('Event', EventSchema);