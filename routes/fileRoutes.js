var fs = require("fs");
var readline = require("readline");

module.exports = {
	getMenu: (req, res) => {
		getMenu(req, res);
	}
};

var getMenu = (req, res) => {
	// Load client secrets from a local file.
	fs.readFile("./json/menuBar.json", (err, content) => {
		if (err) {
			console.log("Error loading menu file: " + err);
			res.send(500);
			return;
		}
		res.send(JSON.parse(content));
	});
};
