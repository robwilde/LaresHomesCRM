(function () {

    'use strict';

    angular.module('app').directive('shpShell', function () {
        return {
            restrict: "E",
            templateUrl: "App/layout/shell/shell.tpl.html"
        };
    });

})();