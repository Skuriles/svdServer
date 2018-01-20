var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var PersonCategory = new keystone.List('PersonCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

PersonCategory.add({
	name: { type: String, required: true },
});

PersonCategory.relationship({ ref: 'Person', path: 'persons', refPath: 'categories' });

PersonCategory.register();
