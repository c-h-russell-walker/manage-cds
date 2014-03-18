'use strict';
define(['knockout'], function(ko) {
    return function ArtistViewModel(name) {
        var self = this;
        self.name = ko.observable(name);
    };
});