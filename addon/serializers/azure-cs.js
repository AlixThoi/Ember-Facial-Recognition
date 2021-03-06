import DS from 'ember-data';

export default DS.JSONSerializer.extend({


	/**
	 * Convert the image into Blob to pass into Microsoft Detect/addface call
	 * @params dataURL image recieved from webcam
	 * 
	 */
	convertDataUriToBinary(dataURL){
		var BASE64_MARKER = ';base64,';
		if (dataURL.indexOf(BASE64_MARKER) === -1) {
			var part = dataURL.split(',');
			var content = part[0].split(':')[1];
			var rawData = decodeURIComponent(part[1]);
			return new Blob([rawData], { type: content});
		}
		var parts = dataURL.split(BASE64_MARKER);
		var contentType = parts[0].split(':')[1];
		var raw = window.atob(parts[1]);
		var rawLength = raw.length;
		var uInt8Array = new Uint8Array(rawLength);
		for (var i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		var blob = new Blob([uInt8Array], { type: contentType });
		return blob;
	},
	/**
	 * Parse the response and create the groups
	 */
	normalize(modelClass, resourceHash) {
		var idField = this.get('idField');
		var data = {
				id:            resourceHash[idField] || resourceHash.response[idField],
				type:          modelClass.modelName,
				attributes:    resourceHash
		};
		delete resourceHash[idField];
		delete resourceHash.response;
		return { data: data };
	},
	/**
	 * Default serializer
	 */
	serialize(requestHash) {
		var json = this._super(...arguments);
		json[this.get('idField')] = json.id; 
		delete json[this.get('idField')]; 
		return json;
	}
});
