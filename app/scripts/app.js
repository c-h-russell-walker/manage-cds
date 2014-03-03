'use strict';
require(['jquery', 'knockout', 'underscore'], function(jquery, ko, underscore) {

    console.log(underscore);
    
    var CollectionModel = function() {
        this.cds = ko.observableArray([
            { band: 'The Faulty',
              title: 'The Kids are Ready',
              tracks: ko.observableArray([
                'one', 'two', 'three'
            ]),
              releaseDate: '2004',
              price: null
            },
            { band: 'DDF',
              title: 'Means to an End',
              tracks: ko.observableArray([
                'one', 'two', 'three'
            ]),
              releaseDate: '2001',
              price: null
            },
            { band: 'Number 12',
              title: 'Mongrel',
              tracks: ko.observableArray([
                'one', 'two', 'three'
            ]),
              releaseDate: '2007',
              price: null
            }
        ]);
    };

    ko.applyBindings(new CollectionModel());
});