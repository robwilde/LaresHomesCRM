(function () {

    'use strict';

    var controllerId = 'ClientFormCtrl';

    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$uibModalInstance', '$routeParams', '$q', 'common', clientFormCtrl]);

    function clientFormCtrl($scope, $location, $uibModalInstance, $routeParams, $q, common) {


        $scope.save = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    };


})();