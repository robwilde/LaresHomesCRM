(function () {

    'use strict';

    var controllerId = 'ClientsTabsCtrl';
    angular.module('app').controller(controllerId,
        ['$scope', tabCtrl]);

    function tabCtrl($scope) {

        $scope.tabs = [
          { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
          { title: 'Dynamic Title 2', content: 'Dynamic content 2' }
        ];

    };

})();