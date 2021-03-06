import AzureAdapter from '../adapters/azure-cs';
import Ember from 'ember';

/**
 * Set up the addFace adapter 
 */
export default AzureAdapter.extend({
	processData: false,
	pathForType: function() {
		return 'persongroups/{personGroupId}/persons/{personId}/persistedFaces';
	},
	/**
	 * Get the url - replacing the personGroupId
	 */
	getUrl: function(type, addFaceRequest) {
		var url= this._super(...arguments);
		url = url.replace('{personGroupId}', addFaceRequest.personGroupId);
		return url.replace('{personId}', addFaceRequest.personId);
		
		
	},
	headers: Ember.computed('config', function() {
		var headers= this._super(...arguments);
		headers['Content-Type']='application/octet-stream';
		return headers;
	}),
	
});
