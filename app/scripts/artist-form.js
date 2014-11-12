'use strict';
define(['knockout'], function(ko) {
    return function ArtistFormViewModel(title, artist) {
        var self = this;
        self.artist = artist;
        self.save = ko.observable(true);
        self.update = ko.observable(false);
        self.formTitle = ko.observable(title);
        self.nameInput = ko.observable(artist.name());

        self.updateArtist = function(artist, event) {
            self.artist = artist;
            self.save(false);
            self.update(true);

            self.show();
            self.formTitle('Edit this artist');
            self.nameInput(artist.name());
        };

        self.saveUpdate = function() {
            var oldArtistName = self.artist.name();
            self.artist.name(self.nameInput());

            self.updateLocalStorage(oldArtistName);

            self.resetForm();
            self.hide();
        };

        self.updateLocalStorage = function(oldArtistName) {
            var storedArtists = JSON.parse(localStorage.getItem('ArtistCollection'));
            for(var a=0; a < storedArtists.length; a++) {
                if (storedArtists[a].name === oldArtistName) {
                    storedArtists[a].name = self.artist.name();
                }
            }

            localStorage.removeItem('ArtistCollection');
            localStorage.setItem('ArtistCollection', ko.toJSON(storedArtists));
        };

        self.resetForm = function() {
            self.formTitle('Add a new artist');
            self.save(true);
            self.update(false);
            self.clearInputs();
        };

        self.clearInputs = function() {
            self.nameInput('');
        };

        self.show = function() {
            $('#artistFormDialog').modal('show').on('shown.bs.modal', function () {
                $('.modal-body #name').focus();
            });
        };

        self.hide = function() {
            $('#artistFormDialog').modal('hide');
        };
    };
});