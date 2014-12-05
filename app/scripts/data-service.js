'use strict';
define(['knockout', './cd', './artist'], function(ko, CdViewModel, ArtistViewModel) {
    return function DataService(CdPageViewModel) {
        var self = this;
        
        self.preloadCds = function() {
            var tempDdf,
                tempNumber12,
                tempTheFaulty;
            if(!localStorage.getItem('ArtistCollection')) {
                tempDdf = new ArtistViewModel('DDF');
                tempNumber12 = new ArtistViewModel('Number 12');
                tempTheFaulty = new ArtistViewModel('The Faulty');
                CdPageViewModel.artists.push(tempDdf);
                CdPageViewModel.artists.push(tempNumber12);
                CdPageViewModel.artists.push(tempTheFaulty);
            }

            if (!localStorage.getItem('CdCollection')) {
                CdPageViewModel.cds.push(new CdViewModel('Means to an End', tempDdf, '2000'));
                CdPageViewModel.cds.push(new CdViewModel('Mongrel', tempNumber12, '2007'));
                CdPageViewModel.cds.push(new CdViewModel('The Kids are Ready', tempTheFaulty, '2003'));
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));

            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
        };

        self.clearStorage = function() {
            localStorage.removeItem('CdCollection');
            localStorage.removeItem('ArtistCollection');
        };

        self.updateCdLocalStorage = function(form, oldAlbumName) {
            var storedCds = self.getStoredCds();
            for(var c=0; c < storedCds.length; c++) {
                if (storedCds[c].album === oldAlbumName) {
                    storedCds[c].album = form.cd.album();
                    storedCds[c].artist = form.cd.artist;
                    storedCds[c].releaseDate = form.cd.releaseDate();
                }
            }

            localStorage.setItem('CdCollection', ko.toJSON(storedCds));
        };

        self.updateArtistLocalStorage = function(form, oldArtistName) {
            var storedArtists = self.getStoredArtists();
            for(var a=0; a < storedArtists.length; a++) {
                if (storedArtists[a].name === oldArtistName) {
                    storedArtists[a].name = form.artist.name();
                }
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(storedArtists));
        };

        self.getStoredCds = function() {
            return JSON.parse(localStorage.getItem('CdCollection'));
        };

        self.getStoredArtists = function() {
            return JSON.parse(localStorage.getItem('ArtistCollection'));
        };

        self.saveArtistsAndCds = function() {
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));
        };

        self.saveCd = function(form) {
            var storedArtists = self.getStoredArtists(),
                artistRef,
                oldAlbumName = form.cd.album();
            
            form.cd.album(form.albumInput());
            
            for(var a=0; a < storedArtists.length; a++) {
                if (storedArtists[a].name === form.artistInput()) {
                    artistRef = storedArtists[a];
                }
            }
            form.cd.artist(artistRef);
            form.cd.releaseDate(form.releaseDateInput());
            
            self.updateCdLocalStorage(form, oldAlbumName);
        };

        self.saveArtist = function(form) {
            var oldArtistName = form.artist.name();
            form.artist.name(form.nameInput());

            self.updateArtistLocalStorage(form, oldArtistName);
        };

    };
});