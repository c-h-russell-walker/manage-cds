'use strict';
define(['knockout', './cd', './artist'], function(ko, CdViewModel, ArtistViewModel) {
    return function DataService(CdPageViewModel) {
        var self = this;
        
        self.preloadCds = function() {
            var tempDdf,
                tempNumber12,
                tempTheFaulty;
            if(!localStorage.getItem('ArtistCollection')) {
                tempDdf = new ArtistViewModel('DDF');
                tempNumber12 = new ArtistViewModel('Number 12');
                tempTheFaulty = new ArtistViewModel('The Faulty');
                CdPageViewModel.artists.push(tempDdf);
                CdPageViewModel.artists.push(tempNumber12);
                CdPageViewModel.artists.push(tempTheFaulty);
            }

            if (!localStorage.getItem('CdCollection')) {
                CdPageViewModel.cds.push(new CdViewModel('Means to an End', tempDdf, '2000'));
                CdPageViewModel.cds.push(new CdViewModel('Mongrel', tempNumber12, '2007'));
                CdPageViewModel.cds.push(new CdViewModel('The Kids are Ready', tempTheFaulty, '2003'));
            }

            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));

            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
        };

        self.clearStorage = function() {
            localStorage.removeItem('CdCollection');
            localStorage.removeItem('ArtistCollection');
        };

        self.getStoredCds = function() {
            return JSON.parse(localStorage.getItem('CdCollection'));
        };

        self.getStoredArtists = function() {
            return JSON.parse(localStorage.getItem('ArtistCollection'));
        };

        self.saveArtistsAndCds = function() {
            self.clearStorage();
            localStorage.setItem('CdCollection', ko.toJSON(CdPageViewModel.cds()));
            localStorage.setItem('ArtistCollection', ko.toJSON(CdPageViewModel.artists()));
        };

    };
});