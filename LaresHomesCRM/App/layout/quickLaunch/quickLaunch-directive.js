(function () {

    'use strict';

    angular.module('app').directive('quickLaunch', function () {
        return {
            restrict: "E",
            templateUrl: "App/layout/quickLaunch/quickLaunch.tpl.html"
        };
    });

})();