/**
 * Adapter for the Azure face API
 * Requires:  ENV.APP.recognition.subscriptionKey in the config/environment of your application
 */
import Ember from 'ember';
import DS from 'ember-data';
import {v4} from 'ember-uuid';
import $ from 'jquery'; 
export default DS.Adapter.extend({
	processData: false,
	dataType: 'json',
	headers: Ember.computed('config', function() {
		return {
			"Content-Type":"application/json",
			"Ocp-Apim-Subscription-Key":this.getConfig().subscriptionKey
		};
	}),
	/**
	 * Do a POST to the MCS and return the results as an facial model
	 * 
	 */
	createRecord(store, type, snapshot) {
		snapshot.id =  v4();
		var data = this.serialize(snapshot, { includeId: true });
		return this.executeQuery('POST', snapshot, data);
	},
	/**
	 * Find a record based on the 
	 */
	findRecord(store, entityType, id, snapshot) {
		return this.executeQuery('GET', snapshot); 
	},

	queryRecord(store, type, query) {
		return this.executeQuery('GET', null, query); 
	},

	findAll(store) {
		return this.executeQuery('GET')
	},

	host: Ember.computed('config',function() {
		return this.getConfig().host;
	}),
	namespace: Ember.computed('config',function() {
		return this.getConfig().namespace;
	}),
	getConfig: function() {
		return Ember.getOwner(this).resolveRegistration('config:environment').APP.recognition;
	}, 

	getParameters: function() { 
		// Implement in subclass as a hash of key/value pairs
		return null; 
	},
	getUrl: function(type,json) {
		var url = this.get('host') + 
		'/' + this.get('namespace') + 
		'/' + this.pathForType();
		var parameters = this.getParameters();
		if(type && (type==="PUT"||type==="GET") && json && json.id) {
			// Add the id on the path
			url += '/'+json.id;
		}
		if (parameters) {
			url += '?' + Ember.$.param(parameters);
		}
		return url; 
	},


	/**
	 * Build the jQuery call and execute
	 * Returns a promise
	 */
	executeQuery: function(type, snapshot, json) {
		var self = this;
		// Set up the body
		// Use a the blob if generated
		var body;
		if (json && json.blob) {
			body = json.blob;
		} else {
			body = JSON.stringify(json);
		}
		return new Ember.RSVP.Promise(function(resolve, reject) {
			$.ajax({	  
				type: type,
				headers: self.get('headers'),
				url: self.getUrl(type,json),
				dataType: self.dataType,
				processData: self.get('processData'),
				data: body
			}).then(function(response) {
				// Check for request/response 
				if (json) {
					json.response=response;
					Ember.run(null, resolve, json);
				} else {
					Ember.run(null, resolve, response);
				}
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	}
});
