'use strict';
define(['knockout', './cd', './artist'], function(ko, CdViewModel, ArtistViewModel) {
    return function DataService() {
        var self = this;
        
        self.preloadCds = function(CdModelCollection) {
            var tempDdf,
                tempNumber12,
                tempTheFaulty;
            if(!localStorage.getItem('ArtistCollection')) {
                tempDdf = new ArtistViewModel('DDF');
                tempNumber12 = new ArtistViewModel('Number 12');
                tempTheFaulty = new ArtistViewModel('The Faulty');
                CdModelCollection.artists.push(tempDdf);
                CdModelCollection.artists.push(tempNumber12);
                CdModelCollection.artists.push(tempTheFaulty);
            }

            if (!localStorage.getItem('CdCollection')) {
                CdModelCollection.cds.push(new CdViewModel('Means to an End', tempDdf, '2000'));
                CdModelCollection.cds.push(new CdViewModel('Mongrel', tempNumber12, '2007'));
                CdModelCollection.cds.push(new CdViewModel('The Kids are Ready', tempTheFaulty, '2003'));
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(CdModelCollection.artists()));

            localStorage.setItem('CdCollection', ko.toJSON(CdModelCollection.cds()));
        };

        self.clearStorage = function() {
            localStorage.removeItem('CdCollection');
            localStorage.removeItem('ArtistCollection');
        };

        self.getCdArtist = function(cd) {
            var storedArtists = self.getStoredArtists(),
                returnArtist;
            storedArtists.forEach(function iterateStoredArtistsToGetArtistFromCd(artist) {
                if (cd.artist && cd.artist.name === artist.name) {
                    returnArtist = artist;
                }
            });
            return returnArtist;
        };

        self.getArtistByName = function(name) {
            var storedArtists = self.getStoredArtists(),
                returnArtist;
            storedArtists.forEach(function iterateStoredArtistsToGetArtistByName(artist) {
                if (name === artist.name) {
                    returnArtist = artist;
                }
            });
            return returnArtist;
        };

        self.updateCdLocalStorage = function(form, oldAlbumName) {
            var storedCds = self.getStoredCds();
            storedCds.forEach(function iterateStoredCds(cd) {
                if (cd.album === oldAlbumName) {
                    cd.album = form.cd.album();
                    cd.artist = form.cd.artist;
                    cd.releaseDate = form.cd.releaseDate();
                }
            });

            localStorage.setItem('CdCollection', ko.toJSON(storedCds));
        };

        self.updateArtistLocalStorage = function(form, oldArtistName) {
            var storedArtists = self.getStoredArtists(),
                storedCds = self.getStoredCds();
            
            storedArtists.forEach(function iterateStoredArtists(artist) {
                if (artist.name === oldArtistName) {
                    artist.name = form.artist.name();
                }
            });

            // We also need to update the values for any albums that have that artist
            storedCds.forEach(function iterateStoredCdsForArtistUpdate(cd) {
                if (cd.artist.name === oldArtistName) {
                    cd.artist.name = form.artist.name();
                }
            });

            localStorage.setItem('ArtistCollection', ko.toJSON(storedArtists));
            localStorage.setItem('CdCollection', ko.toJSON(storedCds));
        };

        self.getStoredCds = function() {
            return JSON.parse(localStorage.getItem('CdCollection'));
        };

        self.getStoredArtists = function() {
            return JSON.parse(localStorage.getItem('ArtistCollection'));
        };

        self.saveArtistsAndCds = function(CdModelCollection) {
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(CdModelCollection.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdModelCollection.artists()));
        };

        self.saveCd = function(form) {
            var storedArtists = self.getStoredArtists(),
                artistRef,
                oldAlbumName = form.cd.album();
            
            form.cd.album(form.albumInput());
            
            storedArtists.forEach(function iterateStoredArtistsDuringCdSave(artist) {
                if (artist.name === form.artistInput()) {
                    artistRef = artist;
                }
            });
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