require.config({
    paths: {
        app: '../scripts/app',
        cd: '../scripts/cd',
        artist: '../scripts/artist',
        form: '../scripts/form',
        collection: '../scripts/collection',
        require: '../bower_components/requirejs/require',
        jquery: '../bower_components/jquery/jquery',
        knockout: '../bower_components/knockout/build/output/knockout-latest.debug',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        bootstrapAffix: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/affix',
        bootstrapAlert: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/alert',
        bootstrapButton: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/button',
        bootstrapCarousel: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/carousel',
        bootstrapCollapse: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/collapse',
        bootstrapDropdown: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/dropdown',
        bootstrapModal: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/modal',
        bootstrapPopover: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/popover',
        bootstrapScrollspy: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/scrollspy',
        bootstrapTab: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/tab',
        bootstrapTooltip: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/tooltip',
        bootstrapTransition: '../bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap/transition'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapAffix: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapCollapse: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapDropdown: {
            deps: ['jquery']
        },
        bootstrapModal:{
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapPopover: {
            deps: ['jquery', 'bootstrapTooltip']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTooltip: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTransition: {
            deps: ['jquery']
        }
    }
});

require(['app', 'require', 'jquery', 'knockout', 'underscore', 'bootstrap'], function (app, require, jQuery, ko, underscore, bootstrap) {
    'use strict';
    // // use app here
    // console.log(app);
    // console.log(require);
    // console.log('Running jQuery %s', jQuery().jquery);
    // console.log('Running Knockout %s', ko.version);
    // console.log(underscore);
    // console.log(bootstrap);
});
