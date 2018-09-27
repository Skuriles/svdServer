var keystone = require("keystone");
var Post = keystone.list("Post");
var PostCategory = keystone.list("PostCategory");

module.exports = {
	getPostsByCategory: (req, res) => {
		getPostsByCategory(req, res);
	},
	getCategory: (req, res) => {
		getCategory(req, res);
	},
	getPostById: (req, res) => {
		getPostById(req, res);
	}
};

var getPostsByCategory = (req, res) => {
	var categories = req.body;
	if (!categories) {
		categories = [];
	}
	var searchCats = [];
	PostCategory.model.find({ key: { $in: categories } }, (err, cats) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		for (let i = 0; i < cats.length; i++) {
			const category = cats[i];
			searchCats.push(category._id);
		}
		Post.model
			.find({ categories: { $in: searchCats }, state: "published" })
			.exec((err, posts) => {
				if (err) {
					res.sendStatus(500);
					return;
				}
				res.send(posts);
				return;
			});
	});
};

var getCategory = (req, res) => {
	return res.sendStatus(204);
};

var getPostById = (req, res) => {
	Post.model.findById(req.body.id, (err, post) => {
		if (err) {
			res.sendStatus(500);
			return;
		}
		res.send(post);
		return;
	});
};
