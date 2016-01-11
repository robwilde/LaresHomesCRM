(function () {

    'use strict';

    angular.module('app').directive('workingOnIt', function () {
        return {
            restrict: "E",
            templateUrl: "App/layout/workingOnIt/workingOnIt.tpl.html"
        };
    });

})();