import Ember from 'ember';

// app/routes/api.js
export default Ember.Route.extend({

	model: function() {
		return {
			detectRequest: this.store.createRecord('mcs-detect-Request'),
			person: this.store.createRecord('mcs-person'),
			personGroup: this.store.createRecord('mcsPersonGroup')
		};
	}
});
