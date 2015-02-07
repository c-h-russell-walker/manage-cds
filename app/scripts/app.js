'use strict';
require(['knockout', './data-service', './page' ], function(ko, DataService, CdPageViewModel) {

    // We have this here if we want or need to pass to other modules besides the CdPage
    var dataService = new DataService();

    ko.applyBindings(new CdPageViewModel(dataService));

});