'use strict';
define(['knockout'], function(ko) {
    return function(title, cd) {
        var self = this;
        self.cd = cd;
        self.save = ko.observable(true);
        self.update = ko.observable(false);
        self.formTitle = ko.observable(title);
        self.albumInput = ko.observable(cd.album());
        self.artistInput = ko.observable(cd.artist());
        self.releaseDateInput = ko.observable(cd.releaseDate());

        self.updateCd = function(cd) {
            self.cd = cd;
            self.save(false);
            self.update(true);
            self.show();

            self.formTitle('Edit this CD');
            self.albumInput(cd.album());
            self.artistInput(cd.artist());
            self.releaseDateInput(cd.releaseDate());
        };

        self.saveUpdate = function() {
            self.cd.album(self.albumInput());
            self.cd.artist(self.artistInput());
            self.cd.releaseDate(self.releaseDateInput());

            self.resetForm();
            self.hide();
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

        self.show = function() {
            $('#windowTitleDialog').modal('show');
        };

        self.hide = function() {
            $('#windowTitleDialog').modal('hide');
        };
    };
});