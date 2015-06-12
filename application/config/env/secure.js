'use strict';

module.exports = {
	port: 443,
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/automatedmanagement',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '847735498647328',
		clientSecret: process.env.FACEBOOK_SECRET || '1aab7e44d033123571729cdc3b3f3308',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || '04nYQg6uWsh2xM6NYJjS0mReD',
		clientSecret: process.env.TWITTER_SECRET || 'IMk4PVatT0hs2Uznr8AwvUtjEnRDigptIamdFvYpG17tIMq36b',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '134003119667-b3q4hnvp1oj9u68u4roo0gsu76q2u4p3.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'P45J7jGkvlfELk942B-FV6oO',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '775yq8tae9oiho',
		clientSecret: process.env.LINKEDIN_SECRET || 'isx5MGnhwLXIjZgZ',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'd9606924590da094a957',
		clientSecret: process.env.GITHUB_SECRET || '54ff1ea348bb1c67059925dcca5fb8467f2dfb4d',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};