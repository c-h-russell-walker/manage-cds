'use strict';
define(['knockout', 'underscore', './cd', './artist'],
        function(ko, _, CdViewModel, ArtistViewModel) {
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

        self.getCdArtist = function(cd) {
            if (cd.artist) {
                return findArtistByName(self.getStoredArtists(), cd.artist.name);
            }
        };

        /* This is now just a wrapper to publicly access our newly written finder function */
        self.getArtistByName = function(name) {
            return findArtistByName(self.getStoredArtists(), name);
        };

        self.updateCdLocalStorage = function(form, oldAlbumName) {
            var storedCds = self.getStoredCds(),
                cd = findCdByAlbumName(storedCds, oldAlbumName);

            if (!cd) {
                throw new Error('Hmm, can\'t be updating an album if we don\'t even have it.');
            }

            cd.album = form.cd.album();
            cd.artist = form.cd.artist;
            cd.releaseDate = form.cd.releaseDate();

            localStorage.setItem('CdCollection', ko.toJSON(storedCds));
        };

        self.updateArtistLocalStorage = function(form, oldArtistName) {
            var artistRef,
                storedCds = self.getStoredCds(),
                storedArtists = self.getStoredArtists();
            
            // Set new name
            artistRef = findArtistByName(storedArtists, oldArtistName);
            if (!artistRef) {
                throw new Error('Hmm, can\'t be updating an artist if we don\'t even have it.');
            }
            artistRef.name = form.artist.name();

            // We also need to update the values for any albums that have that artist
            var cds = findCdsByArtistName(storedCds, oldArtistName);
            if (!cds) {
                throw new Error('Hmm, something went wrong while trying to get CDs by an artist.');
            }

            // cds can be an empty array if that artist has no CDs in our collection
            _.each(cds, function updateArtistName(cd) {
                console.log(cd);
                cd.artist.name = form.artist.name();
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

        self.saveArtistsAndCds = function() {
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));
        };

        self.saveCd = function(form) {
            var artistRef,
                oldAlbumName = form.cd.album();
            
            form.cd.album(form.albumInput());

            artistRef = findArtistByName(self.getStoredArtists(), form.artistInput());

            // artistRef can be undefined if no artist is listed when updating a CD
            form.cd.artist(artistRef);
            form.cd.releaseDate(form.releaseDateInput());
            
            self.updateCdLocalStorage(form, oldAlbumName);
        };

        self.saveArtist = function(form) {
            var oldArtistName = form.artist.name();
            form.artist.name(form.nameInput());

            self.updateArtistLocalStorage(form, oldArtistName);
        };

        /* Local functions */

        function findCdByAlbumName(storedCds, oldAlbumName) {
            /* We're explicitly passing in storedCds so we have reference to the exact object */
            if (!storedCds) {
                throw new Error('Hmm, we need you to pass in storedCds. Try using getStoredCds().');
            }

            return _.find(storedCds, function albumNameEquality(cd) {
                return cd.album === oldAlbumName;
            });
        }

        function findCdsByArtistName(storedCds, name) {
            return _.filter(storedCds, function cdArtistNameEquality(cd) {
                return cd.artist.name === name;
            });
        }

        function findArtistByName(storedArtists, name) {
            /* We're explicitly passing in storedArtists so we have reference to the exact object */
            if (!storedArtists) {
                throw new Error('Hmm, we need you to pass in storedArtists. Try using getStoredArtists().');
            }

            return _.find(storedArtists, function artistNameEquality(artist) {
                return artist.name === name;
            });
        }
    };
});