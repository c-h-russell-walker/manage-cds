'use strict';
define(['knockout', 'underscore', './cd', './artist'],
        function(ko, _, CdViewModel, ArtistViewModel) {
    return function DataService(CdPageViewModel) {
        var self = this,
            storedCds,
            storedArtists;
        
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

        /* This is now just a wrapper to publicly access our newly written finder function */
        self.getArtistByName = function(name) {
            return findArtistByName(name);
        };

        self.updateCdStorage = function(form, oldAlbumName) {
            var cd = findCdByAlbumName(oldAlbumName);

            if (!cd) {
                throw new Error('Hmm, can\'t be updating an album if we don\'t even have it.');
            }

            cd.album = form.cd.album();
            cd.artist = form.cd.artist;
            cd.releaseDate = form.cd.releaseDate();

            localStorage.setItem('CdCollection', ko.toJSON(self.getStoredCds()));
        };

        self.updateArtistStorage = function(form, oldArtistName) {
            var artistRef;
            // Set new name
            artistRef = findArtistByName(oldArtistName);
            if (!artistRef) {
                throw new Error('Hmm, can\'t be updating an artist if we don\'t even have it.');
            }
            artistRef.name = form.artist.name();

            // We also need to update the values for any albums that have that artist
            var cds = findCdsByArtistName(oldArtistName);
            if (!cds) {
                throw new Error('Hmm, something went wrong while trying to get CDs by an artist.');
            }
            _.each(cds, function updateArtistName(cd) {
                cd.artist.name = form.artist.name();
            });

            localStorage.setItem('ArtistCollection', ko.toJSON(self.getStoredArtists()));
            localStorage.setItem('CdCollection', ko.toJSON(self.getStoredCds()));
        };

        self.getStoredCds = function() {
            storedCds = storedCds || JSON.parse(localStorage.getItem('CdCollection'));
            return storedCds;
        };

        self.getStoredArtists = function() {
            storedArtists = storedArtists || JSON.parse(localStorage.getItem('ArtistCollection'));
            return storedArtists;
        };

        self.saveArtistsAndCds = function() {
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));
        };

        self.saveCd = function(form) {
            var artistRef,
                oldAlbumName = form.cd.album();
            
            form.cd.album(form.albumInput());

            artistRef = findArtistByName(form.artistInput());

            // artistRef can be undefined if no artist is listed when updating a CD
            form.cd.artist(artistRef);
            form.cd.releaseDate(form.releaseDateInput());
            
            self.updateCdStorage(form, oldAlbumName);
        };

        self.saveArtist = function(form) {
            var oldArtistName = form.artist.name();
            form.artist.name(form.nameInput());

            self.updateArtistStorage(form, oldArtistName);
        };

        /* Local functions */

        function findCdByAlbumName(albumName) {
            return _.findWhere(self.getStoredCds(), {album: albumName});
        }

        function findCdsByArtistName(name) {
            return _.filter(self.getStoredCds(), function cdArtistNameEquality(cd) {
                return cd.artist.name === name;
            });
        }

        function findArtistByName(name) {
            return _.findWhere(self.getStoredArtists(), {name: name});
        }
    };
});