'use strict';
define(['jquery', 'knockout', 'underscore'], function(jQuery, ko, underscore) {

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
        self.albumInput = ko.observable('');
        self.artistInput = ko.observable('');
        self.releaseDateInput = ko.observable('');

        self.cds = ko.observableArray([
            // new CdModel('The Kids are Ready', new Artist('The Faulty'), '2004'),
            // new CdModel('Means to an End', new Artist('DDF'), '2001'),
            // new CdModel('Mongrel', new Artist('Number 12'), '2007')
            new CdModel('The Kids are Ready', 'The Faulty', '2004'),
            new CdModel('Means to an End', 'DDF', '2001'),
            new CdModel('Mongrel', 'Number 12', '2007')
        ]);

        self.addCd = function() {
            self.cds.push(new CdModel(this.albumInput(), this.artistInput(), this.releaseDateInput()));
            $('#windowTitleDialog').modal('hide');
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
        };
    };

    ko.applyBindings(new CollectionModel());

});