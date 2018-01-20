var keystone = require('keystone');
var blogRoutes = require('./blogRoutes')


// Setup Route Bindings
exports = module.exports = function (app) {
	// Views	
	app.post('/blog/getCategories', blogRoutes.getCategories);
	app.post('/blog/:category?', blogRoutes.getCategories);
	app.post('/blog/post/:post', blogRoutes.getPost);	

};
