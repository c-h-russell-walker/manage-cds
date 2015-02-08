'use strict';
define(['knockout', 'underscore', './cd', './artist'],
        function(ko, _, CdViewModel, ArtistViewModel) {
    return function DataService(CdModelCollection) {
        var self = this,
            storedCds,
            storedArtists;
        
        self.preloadCds = function() {
            var tempArtists = ['DDF', 'The Number 12', 'The Faulty'].map(function (name) {
                return new ArtistViewModel(name);
            });

            [].push.apply(CdModelCollection.artists(), tempArtists);

            var tempCds = [{
                artist: tempArtists[0],
                album: 'Means to an End',
                releaseDate: '2000',
            },
            {
                artist: tempArtists[1],
                album: 'Mongrel',
                releaseDate: '2007',
            },
            {
                artist: tempArtists[2],
                album: 'The Kids are Ready',
                releaseDate: '2003',
            },
            ].map(function (albumObj) {
                return new CdViewModel(albumObj.album, albumObj.artist, albumObj.releaseDate);
            });

            [].push.apply(CdModelCollection.cds(), tempCds);

            CdModelCollection.cds.valueHasMutated();
            CdModelCollection.artists.valueHasMutated();

            self.saveArtistsAndCds();
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
            confirmStorageSynced();
            var cd = findCdByAlbumName(oldAlbumName);

            if (!cd) {
                throw new Error('Hmm, can\'t be updating an album if we don\'t even have it.');
            }

            cd.album = form.cd.album();
            cd.artist = form.cd.artist;
            cd.releaseDate = form.cd.releaseDate();

            localStorage.setItem('CdCollection', ko.toJSON(self.getStoredCds()));
        };

        self.addToCdStorage = function() {
            localStorage.removeItem('CdCollection');
            self.saveArtistsAndCds();
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
            localStorage.setItem('CdCollection', ko.toJSON(CdModelCollection.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdModelCollection.artists()));
            confirmStorageSynced();
        };

        self.removeCdFromStorage = function(staleCd) {
            storedCds = _.filter(storedCds, function(cd) {
                return cd.album !== staleCd.album();
            });
            confirmStorageSynced();
        };

        self.saveCd = function(form) {
            confirmStorageSynced();

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

        function confirmStorageSynced() {
            if (CdModelCollection.cds().length !== JSON.parse(localStorage.getItem('CdCollection').length)) {
                storedCds = null;
                storedCds = self.getStoredCds();
                localStorage.setItem('CdCollection', ko.toJSON(CdModelCollection.cds()));
            }
            if (CdModelCollection.artists().length !== JSON.parse(localStorage.getItem('ArtistCollection').length)) {
                storedArtists = null;
                storedArtists = self.getStoredArtists();
                localStorage.setItem('ArtistCollection', ko.toJSON(CdModelCollection.artists()));
            }
        }

        function findCdByAlbumName(albumName) {
            return _.findWhere(storedCds, {album: albumName});
        }

        function findCdsByArtistName(name) {
            return _.filter(storedCds, function cdArtistNameEquality(cd) {
                return cd.artist.name === name;
            });
        }

        function findArtistByName(name) {
            return _.findWhere(storedArtists, {name: name});
        }
    };
});