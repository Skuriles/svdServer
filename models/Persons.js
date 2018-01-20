var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Person = new keystone.List('Person', {
	map: { name: 'name' },
});

Person.add({
	name: { type: String, required: true },
	coach: { type: String },
	position: { type: String },
	isPosition: { type: Boolean},
	isCoach: { type: Boolean },
	categories: { type: Types.Relationship, ref: 'PersonCategory', many: true },
});

Person.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Person.defaultColumns = 'name, isPosition, isCoach, position, coach';
Person.register();
