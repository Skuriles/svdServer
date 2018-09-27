var blogRoutes = require("./blogRoutes");
var calendarRoutes = require("./calendarRoutes");
var fileRoutes = require("./fileRoutes");

// Setup Route Bindings
exports = module.exports = function(app) {
	// Posts
	app.post("/blog/getPostsByCategory", blogRoutes.getPostsByCategory);
	app.post("/blog/getPostById", blogRoutes.getPostById);
	app.post("/blog/:category?", blogRoutes.getCategory);
	// Calendar
	app.post("/calendar/getCalendar", calendarRoutes.getCalendar);
	app.post("/calendar/getPlayCalendar", calendarRoutes.getPlayCalendar);
	// Fileroutes
	app.post("/files/getMenu", fileRoutes.getMenu);
};
