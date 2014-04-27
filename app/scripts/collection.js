'use strict';
define(['knockout', 'cd', 'cd-form', 'artist'], function(ko, CdViewModel, CdFormViewModel, ArtistViewModel) {
    return function CdCollectionViewModel() {
        var self = this;

        self.cdForm = new CdFormViewModel('Add a CD', new CdViewModel('', '', ''));

        self.cds = ko.observableArray();
        self.artists = ko.observableArray();
        self.releaseYears = [];
        var currentYear = new Date().getFullYear();

        for (var y = currentYear; y > 1981; y--) {
            self.releaseYears.push(y);
        }

        self.preloadCds = function() {
            if (!localStorage.getItem('CdCollection')) {
                self.cds.push(new CdViewModel('Means to an End', 'DDF', '2000'));
                self.cds.push(new CdViewModel('Mongrel', 'Number 12', '2007'));
                self.cds.push(new CdViewModel('The Kids are Ready', 'The Faulty', '2003'));
            }

            if(!localStorage.getItem('ArtistCollection')) {
                self.artists.push(new ArtistViewModel('DDF'));
                self.artists.push(new ArtistViewModel('Number 12'));
                self.artists.push(new ArtistViewModel('The Faulty'));
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(self.artists()));

            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
        };

        var storedCds = JSON.parse(localStorage.getItem('CdCollection'));

        if (storedCds) {
            for (var i = 0; i < storedCds.length; i++) {
                self.cds.push(new CdViewModel(storedCds[i].album, storedCds[i].artist.name, storedCds[i].releaseDate));
            }
        }

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm.albumInput(), self.cdForm.artistInput(), self.cdForm.releaseDateInput()));
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
            self.cdForm.hide();
            self.cdForm.resetForm();
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
            if (self.cds().length < 1) {
                self.clearStorage();
            }
        };

        self.clearStorage = function() {
            localStorage.removeItem('CdCollection');
            localStorage.removeItem('ArtistCollection');
        };

        self.clear = function() {
            self.clearStorage();
            self.cds([]);
        };
    };
});