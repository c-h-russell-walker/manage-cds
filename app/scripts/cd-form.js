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
            // Publish event which the page controller subscribes to and passes to dataservice
            emitter.emit('saveCd', self);

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