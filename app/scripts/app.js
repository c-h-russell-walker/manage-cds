'use strict';
require(['jquery', 'knockout'], function(jquery, ko) {
	
	// @todo - build actual models etc. ;)
	var bandModel = function() {
		this.bands = ko.observableArray(["The Faulty", "DDF", "Number 12"]);
	};

	ko.applyBindings(new bandModel());
});