'use strict';
define(['knockout', './cd', './artist', './cd-form', './artist-form'], function(ko, CdViewModel, ArtistViewModel, CdFormViewModel, ArtistFormViewModel) {
    return function CdPageViewModel() {
        var self = this;

        self.cdManager = ko.observable(true);
        self.artistManager = ko.observable(false);

        self.cdForm = new CdFormViewModel('Add a CD', new CdViewModel('', {}, ''));
        self.artistForm = new ArtistFormViewModel('Add a new artist', new ArtistViewModel('', '', ''));

        self.cds = ko.observableArray();
        self.artists = ko.observableArray();
        self.releaseYears = [];
        var currentYear = new Date().getFullYear();

        for (var y = currentYear; y > 1981; y--) {
            self.releaseYears.push(y);
        }

        self.preloadCds = function() {
            var tempDdf,
                tempNumber12,
                tempTheFaulty;
            if(!localStorage.getItem('ArtistCollection')) {
                tempDdf = new ArtistViewModel('DDF');
                tempNumber12 = new ArtistViewModel('Number 12');
                tempTheFaulty = new ArtistViewModel('The Faulty');
                self.artists.push(tempDdf);
                self.artists.push(tempNumber12);
                self.artists.push(tempTheFaulty);
            }

            if (!localStorage.getItem('CdCollection')) {
                self.cds.push(new CdViewModel('Means to an End', tempDdf, '2000'));
                self.cds.push(new CdViewModel('Mongrel', tempNumber12, '2007'));
                self.cds.push(new CdViewModel('The Kids are Ready', tempTheFaulty, '2003'));
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(self.artists()));

            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
        };

        var storedCds = JSON.parse(localStorage.getItem('CdCollection')),
            storedArtists = JSON.parse(localStorage.getItem('ArtistCollection'));

        if (storedArtists && storedCds) {
            for (var j = 0; j < storedArtists.length; j++) {
                self.artists.push(new ArtistViewModel(storedArtists[j].name));
            }
            for (var i = 0; i < storedCds.length; i++) {
                self.cds.push(new CdViewModel(storedCds[i].album, storedArtists[i], storedCds[i].releaseDate));
            }
        }

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm.albumInput(), self.cdForm.artistInput(), self.cdForm.releaseDateInput()));
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(self.artists()));
            self.cdForm.hide();
            self.cdForm.resetForm();
        };

        self.addArtist = function() {
            self.artists.push(new ArtistViewModel(self.artistForm.nameInput()));
            self.clearStorage();
            localStorage.setItem('ArtistCollection', ko.toJSON(self.artists()));
            localStorage.setItem('CdCollection', ko.toJSON(self.cds()));
            self.artistForm.hide();
            self.artistForm.resetForm();
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
            self.artists([]);
        };

        self.manageCds = function() {
            self.cdManager(true);
            self.artistManager(false);
        };

        self.manageArtists = function() {
            self.cdManager(false);
            self.artistManager(true);
        };
    };
});