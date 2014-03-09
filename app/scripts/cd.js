'use strict';
define(['knockout'], function(ko) {
	return function(album, artist, releaseDate) {
	    var self = this;
	    self.album = ko.observable(album);
	    // @todo - make a CD compromised of smaller objects (make artist reusable)
	    self.artist = ko.observable(artist);
	    self.releaseDate = ko.observable(releaseDate);
	};
});