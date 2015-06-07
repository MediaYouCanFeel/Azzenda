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
    scheduledDateTimeRange: {
        start: {
            type: Date
        },
        end: {
            type: Date
        },
        length: {
            type: Number
        }
    },
    requestedDateTimeRange: {
        dateTimes: [{
            start: Date,
            end: Date,
            parameters: [{
                type: String
            }]
        }],
        length: {
            type: Number
        }
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
            type: String,
            enum: ['pending', 'attending','declined']
        },
        parameters: [{
            type: String
        }]
    }],
    status: {
        type: String
    },
    scheduleParameters: [{
        type: String
    }]
});

mongoose.model('Event', EventSchema);