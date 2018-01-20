// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var Keys = require('./privateKeys/keys');
keystone.init({
	'name': 'SV Deggenhausertal',
	'brand': 'SV Deggenhausertal',

	'less': 'public',
	'static': 'public',		
	'mongo': Keys.mongoConnection,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': Keys.cookieKey,
	'port': 61002

});
keystone.import('models');
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});
keystone.set('routes', require('./routes'));

keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	users: 'users',
});


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}


keystone.start();
