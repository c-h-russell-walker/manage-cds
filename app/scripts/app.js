'use strict';
define(['jquery', 'knockout', 'underscore'], function(jQuery, ko, underscore) {

    // console.log(underscore);

    var CollectionViewModel = function() {

        var CdViewModel = function(album, artist, releaseDate) {
            var self = this;
            self.album = ko.observable(album);
            // @todo - make a CD compromised of smaller objects (make artist reusable)
            self.artist = ko.observable(artist);
            self.releaseDate = ko.observable(releaseDate);
        };

        var CdFormViewModel = function(title, cd) {
            var self = this;
            self.cd = cd;
            self.open = ko.observable(false);
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
                self.open(true);
                $('#windowTitleDialog').modal('show');
            };

            self.hide = function() {
                self.open(false);
                $('#windowTitleDialog').modal('hide');
            };
        };

        var self = this;

        self.cdForm = ko.observable(new CdFormViewModel('Add a CD', new CdViewModel('', '', '')));

        self.cds = ko.observableArray([
            new CdViewModel('The Kids are Ready', 'The Faulty', '2004'),
            new CdViewModel('Means to an End', 'DDF', '2001'),
            new CdViewModel('Mongrel', 'Number 12', '2007')
        ]);

        self.releaseYears = [];
        var currentYear = new Date().getFullYear();

        for (var i=currentYear; i>1981; i--) {
            self.releaseYears.push(i);
        }

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm().albumInput(), self.cdForm().artistInput(), self.cdForm().releaseDateInput()));
            self.cdForm().hide();
            self.cdForm().resetForm();
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
        };

    };

    ko.applyBindings(new CollectionViewModel());

});