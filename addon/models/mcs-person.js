import DS from 'ember-data';

export default DS.Model.extend({
	name:DS.attr('string'),
	userData: DS.attr('string'),
	personGroupId: DS.attr('string'),
	personId: DS.attr('string')
});
