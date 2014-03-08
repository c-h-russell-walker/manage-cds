'use strict';
define(['jquery', 'knockout', 'underscore'], function(jQuery, ko, underscore) {

    // console.log(underscore);

    var CdCollectionViewModel = function() {

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

        self.cds = ko.observableArray();

        self.preloadCds = function() {
            if (!localStorage.getItem('CdCollection')) {
                self.cds.push(new CdViewModel('Means to an End', 'DDF', '2000'));
                self.cds.push(new CdViewModel('Mongrel', 'Number 12', '2007'));
                self.cds.push(new CdViewModel('The Kids are Ready', 'The Faulty', '2003'));
            }

            localStorage.setItem('CdCollection', JSON.stringify(ko.toJSON(self.cds())));
        };

        var storedCds = JSON.parse(JSON.parse(localStorage.getItem('CdCollection')));

        if (storedCds) {
            for (var i = 0; i < storedCds.length; i++) {
                self.cds.push(new CdViewModel(storedCds[i].album, storedCds[i].artist, storedCds[i].releaseDate));
            }
        }

        self.artists = ko.observableArray();

        self.releaseYears = [];
        var currentYear = new Date().getFullYear();

        for (var y = currentYear; y > 1981; y--) {
            self.releaseYears.push(y);
        }

        self.addCd = function() {
            self.cds.push(new CdViewModel(self.cdForm().albumInput(), self.cdForm().artistInput(), self.cdForm().releaseDateInput()));
            localStorage.removeItem('CdCollection');
            localStorage.setItem('CdCollection', JSON.stringify(ko.toJSON(self.cds())));
            self.cdForm().hide();
            self.cdForm().resetForm();
        };

        self.removeCd = function(cd) {
            self.cds.remove(cd);
            localStorage.removeItem('CdCollection');
            localStorage.setItem('CdCollection', JSON.stringify(ko.toJSON(self.cds())));
            if (self.cds().length < 1) {
                localStorage.removeItem('CdCollection');
            }
        };

    };

    ko.applyBindings(new CdCollectionViewModel());

});