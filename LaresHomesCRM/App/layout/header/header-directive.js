(function () {

    'use strict';

    angular.module('app').directive('shpHeader', function () {
        return {
            restrict: "E",
            templateUrl: "App/layout/header/header.tpl.html"
        };
    });

})();