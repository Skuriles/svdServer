var blogRoutes = require("./blogRoutes");
var calendarRoutes = require("./calendarRoutes");

// Setup Route Bindings
exports = module.exports = function(app) {
	// Posts
	app.post("/blog/getPostsByCategory", blogRoutes.getPostsByCategory);
	app.post("/blog/:category?", blogRoutes.getCategory);
	app.post("/blog/post/:post", blogRoutes.getPost);
	// Calendar
	app.post("/calendar/getCalendar", calendarRoutes.getCalendar);
	app.post("/calendar/getPlayCalendar", calendarRoutes.getPlayCalendar);
};
