var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Person = new keystone.List("Person", {
	autokey: { path: "slug", from: "name", unique: true },
	map: { name: "name" }
});

Person.add({
	name: { type: String, required: true },
	coach: { type: String },
	positionVorstand: { type: String },
	positionJugend: { type: String },
	positionFoerder: { type: String },
	isPosition: { type: Boolean },
	isCoach: { type: Boolean },
	categories: { type: Types.Relationship, ref: "PersonCategory", many: true }
});

Person.schema.virtual("content.full").get(function() {
	return this.content.extended || this.content.brief;
});

Person.defaultColumns =
	"name, isPosition, isCoach, positionVorstand, positionJugend, positionFoerder, coach";
Person.register();
