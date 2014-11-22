'use strict';
define(['knockout'], function(ko) {
    return function CdViewModel(album, artist, releaseDate) {
        var self = this;
        self.album = ko.observable(album);
        self.artist = ko.observable(artist);
        self.releaseDate = ko.observable(releaseDate);
    };
});