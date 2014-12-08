'use strict';
define(['knockout'], function(ko) {
    return function ArtistFormViewModel(title, artist, emitter) {
        var self = this;
        self.artist = artist;
        self.save = ko.observable(true);
        self.update = ko.observable(false);
        self.formTitle = ko.observable(title);
        self.nameInput = ko.observable(artist.name());

        self.updateArtist = function(artist) {
            self.artist = artist;
            self.save(false);
            self.update(true);

            self.show();
            self.formTitle('Edit this artist');
            self.nameInput(artist.name());
        };

        self.saveUpdate = function() {
            // Publish event which the page controller subscribes to and passes to dataservice
            emitter.emit('saveArtist', self);

            self.resetForm();
            self.hide();
        };

        self.addNewArtist = function() {
            self.resetForm();
            self.show();
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