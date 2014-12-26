'use strict';
define(['knockout', './cd', './artist'], function(ko, CdViewModel, ArtistViewModel) {
    return function DataService(CdPageViewModel) {
        var self = this;
        
        self.preloadCds = function() {
            var tempArtists = ['DDF', 'The Number 12', 'The Faulty'].map(function (name) {
                return new ArtistViewModel(name);
            });

            [].push.apply(CdPageViewModel.artists(), tempArtists);

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

            [].push.apply(CdPageViewModel.cds(), tempCds);

            CdPageViewModel.cds.valueHasMutated();
            CdPageViewModel.artists.valueHasMutated();

            self.saveArtistsAndCds();
        };

        self.clearStorage = function() {
            localStorage.removeItem('CdCollection');
            localStorage.removeItem('ArtistCollection');
        };

        self.getCdArtist = function(cd) {
            var storedArtists = self.getStoredArtists(),
                returnArtist;
            storedArtists.forEach(function iterateStoredArtistsToGetArtist(artist) {
                if (cd.artist && cd.artist.name === artist.name) {
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