(function () {

    'use strict';

    angular.module('app').directive('spAppChrome', function () {
        return {
            restrict: "E",
            templateUrl: "App/layout/appChrome/spAppChrome.tpl.html"
            //template: '<div data-ng-controller="spAppChrome as vm" id="chrome_ctrl_container"></div>'
        };
    });

})();
