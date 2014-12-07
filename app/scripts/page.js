'use strict';
define(['knockout', 'tinyEmitter', './data-service', './cd', './artist', './cd-form', './artist-form'],
        function(ko, Emitter, DataService, CdViewModel, ArtistViewModel, CdFormViewModel, ArtistFormViewModel) {
    return function CdPageViewModel() {
        var self = this,
            dataServiceLayer = new DataService(self),
            emitter = new Emitter();

        self.cdManager = ko.observable(true);
        self.artistManager = ko.observable(false);

        self.cdForm = new CdFormViewModel('Add a CD', new CdViewModel('', {}, ''), emitter);
        self.artistForm = new ArtistFormViewModel('Add a new artist', new ArtistViewModel('', '', ''), emitter);

        // Our pub/subs
        emitter.on('saveCd', function processCdSave(formData) {
            dataServiceLayer.saveCd(formData);
        });
        emitter.on('saveArtist', function processArtistSave(formData) {
            // Let's update our front end model
            self.cds().forEach(function asdf(cd) {
                if (cd.artist().name === formData.artist.name()) {
                    cd.artist(formData.artist);
                }
            });
            // This will save on the backend
            dataServiceLayer.saveArtist(formData);
        });

        self.cds = ko.observableArray();
        self.artists = ko.observableArray();
        self.releaseYears = [];

        self.cdAmount = ko.computed(function() {
            return self.cds().length > 0 ? '(' + self.cds().length + ')' : '';
        }, self);

        self.preloadCds = function() {
            dataServiceLayer.preloadCds();
        };

        var storedCds = dataServiceLayer.getStoredCds(),
            storedArtists = dataServiceLayer.getStoredArtists();

        // We have to acount for a user storing a bunch of artists before ever storing a CD
        if (storedArtists) {
            storedArtists.forEach(function iterateStoredArtists(artist) {
                self.artists.push(new ArtistViewModel(artist.name));
            });
        }

        // This uses a data service getter function to retrieve the correct artist per CD
        if (storedArtists && storedCds) {
            storedCds.forEach(function iterateStoredCds(cd) {
                self.cds.push(new CdViewModel(cd.album, dataServiceLayer.getCdArtist(cd), cd.releaseDate));
            });
        }

        // We have this in order to enable submit on enter keypress
        self.cdFormSubmit = function() {
            if (self.cdForm.save()) {
                self.addCd();
            } else {
                self.cdForm.saveUpdate();
            }
        };

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm.albumInput(), self.cdForm.artistInput(), self.cdForm.releaseDateInput()));
            dataServiceLayer.saveArtistsAndCds();
            self.cdForm.hide();
            self.cdForm.resetForm();
        };

        // We have this in order to enable submit on enter keypress
        self.artistFormSubmit = function() {
            if (self.artistForm.save()) {
                self.addArtist();
            } else {
                self.artistForm.saveUpdate();
            }
        };

        self.addArtist = function() {
            self.artists.push(new ArtistViewModel(self.artistForm.nameInput()));
            dataServiceLayer.saveArtistsAndCds();
            self.artistForm.hide();
            self.artistForm.resetForm();
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
            dataServiceLayer.saveArtistsAndCds();
            if (self.cds().length < 1) {
                self.clearStorage();
            }
        };

        self.clearStorage = function() {
            dataServiceLayer.clearStorage();
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

        /* Local functions */
        
        function loadReleaseYears() {
            var currentYear = new Date().getFullYear();

            for (var y = currentYear; y > 1981; y--) {
                self.releaseYears.push(y);
            }
        }

        // IIFE - use for initialization
        (function initializeCdPage() {
            loadReleaseYears();
        })();
    };
});