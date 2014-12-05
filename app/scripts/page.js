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
            dataServiceLayer.saveArtist(formData);
        });

        self.cds = ko.observableArray();
        self.artists = ko.observableArray();
        self.releaseYears = [];

        self.cdAmount = ko.computed(function() {
            return self.cds().length > 0 ? '(' + self.cds().length + ')' : '';
        }, self);

        self.loadReleaseYears = function() {
            var currentYear = new Date().getFullYear();

            for (var y = currentYear; y > 1981; y--) {
                self.releaseYears.push(y);
            }
        };

        self.preloadCds = function() {
            dataServiceLayer.preloadCds();
        };

        var storedCds = dataServiceLayer.getStoredCds(),
            storedArtists = dataServiceLayer.getStoredArtists();

        // We have to acount for a user storing a bunch of artists before ever storing a CD
        if (storedArtists) {
            for (var j = 0; j < storedArtists.length; j++) {
                self.artists.push(new ArtistViewModel(storedArtists[j].name));
            }
        }

        // TODO: Big to do - this needs to not be dependent on storedArtists
        if (storedArtists && storedCds) {
            for (var i = 0; i < storedCds.length; i++) {
                self.cds.push(new CdViewModel(storedCds[i].album, storedArtists[i], storedCds[i].releaseDate));
            }
        }

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm.albumInput(), self.cdForm.artistInput(), self.cdForm.releaseDateInput()));
            dataServiceLayer.saveArtistsAndCds();
            self.cdForm.hide();
            self.cdForm.resetForm();
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

        // IIFE - use for initialization
        (function initializeCdPage() {
            self.loadReleaseYears();
        })();
    };
});