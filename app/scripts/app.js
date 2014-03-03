'use strict';
require(['jquery', 'knockout', 'underscore'], function(jquery, ko, underscore) {

    console.log(underscore);

    var CdModel = function(album, artist, releaseDate) {
        var self = this;
        self.album = ko.observable(album);
        self.releaseDate = ko.observable(releaseDate);
        // @todo - make a CD compromised of smaller objects (make artist reusable)
        self.artist = ko.observable(artist);
        // self.artist = ko.observable(new Artist(artist));
    };

    // var Artist = function(name) {
    //     var self = this;
    //     self.name = ko.observable(name);
    // };
    
    var CollectionModel = function() {
        var self = this;

        self.cds = ko.observableArray([
            // new CdModel('The Kids are Ready', new Artist('The Faulty'), '2004'),
            // new CdModel('Means to an End', new Artist('DDF'), '2001'),
            // new CdModel('Mongrel', new Artist('Number 12'), '2007')
            new CdModel('The Kids are Ready', 'The Faulty', '2004'),
            new CdModel('Means to an End', 'DDF', '2001'),
            new CdModel('Mongrel', 'Number 12', '2007')
        ]);

        self.addCd = function() {
            // self.cds.push(new CdModel('', new Artist(''), ''));
            self.cds.push(new CdModel('', '', ''));
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
        };
    };

    ko.applyBindings(new CollectionModel());
});