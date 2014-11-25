'use strict';
define(['knockout'], function(ko) {
    return function CdFormViewModel(title, cd, emitter) {
        var self = this;
        self.cd = cd;
        self.save = ko.observable(true);
        self.update = ko.observable(false);
        self.formTitle = ko.observable(title);
        self.albumInput = ko.observable(cd.album());
        self.artistInput = ko.observable(cd.artist().name);
        self.releaseDateInput = ko.observable(cd.releaseDate());

        self.updateCd = function(cd, event) {
            self.cd = cd;
            self.save(false);
            self.update(true);

            // Used to focus clicked element - Ternary sets classname from jQuery event if it's not a MouseEvent
            var formId = event.srcElement ? event.srcElement.className : event.currentTarget.className;
            self.show(formId);

            self.formTitle('Edit this CD');
            self.albumInput(cd.album());
            if (cd.artist()) {
                self.artistInput(cd.artist().name);
            } else {
                self.artistInput('');
            }
            self.releaseDateInput(cd.releaseDate());
        };

        self.saveUpdate = function() {
            var oldAlbumName = self.cd.album();
            self.cd.album(self.albumInput());
            
            // TODO: get actual object reference from artists object in controller
                // Should this be a map? so we can get it by name or something?
            var storedArtists = JSON.parse(localStorage.getItem('ArtistCollection')),
                artistRef;
            for(var a=0; a < storedArtists.length; a++) {
                if (storedArtists[a].name === self.artistInput()) {
                    artistRef = storedArtists[a];
                }
            }
            self.cd.artist(artistRef);
            self.cd.releaseDate(self.releaseDateInput());
            
            self.updateLocalStorage(oldAlbumName);
            // TODO - write this and remove any CRUD from form module
            emitter.emit('saveCd', self);

            self.resetForm();
            self.hide();
        };

        self.updateLocalStorage = function(oldAlbumName) {
            var storedCds = JSON.parse(localStorage.getItem('CdCollection'));
            for(var c=0; c < storedCds.length; c++) {
                if (storedCds[c].album === oldAlbumName) {
                    storedCds[c].album = self.cd.album();
                    storedCds[c].artist = self.cd.artist;
                    storedCds[c].releaseDate = self.cd.releaseDate();
                }
            }

            localStorage.setItem('CdCollection', ko.toJSON(storedCds));
        };

        self.resetForm = function() {
            self.formTitle('Add a CD');
            self.save(true);
            self.update(false);
            self.clearInputs();
        };

        self.clearInputs = function() {
            self.albumInput('');
            self.artistInput('');
            self.releaseDateInput('');
        };

        self.show = function(formId) {
            $('#cdFormDialog').modal('show').on('shown.bs.modal', function () {
                $('.modal-body #'+formId).focus();
            });
        };

        self.hide = function() {
            $('#cdFormDialog').modal('hide');
        };
    };
});