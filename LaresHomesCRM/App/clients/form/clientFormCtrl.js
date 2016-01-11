(function () {

    'use strict';

    var controllerId = 'ClientFormCtrl';

    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$uibModalInstance', '$routeParams', '$q', 'common', clientFormCtrl]);

    function clientFormCtrl($scope, $location, $uibModalInstance, $routeParams, $q, common) {
        var log = common.logger;

        $scope.client = new lhc.models.client();
        //log.logDebug('Client Model', $scope.client, controllerId);

        $scope.save = function () {
            $uibModalInstance.close($scope.client);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    };


})();