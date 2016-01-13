(function () {

    'use strict';

    var controllerId = 'ClientFormCtrl';

    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$uibModalInstance', '$routeParams', '$q', 'common', 'client', clientFormCtrl]);

    function clientFormCtrl($scope, $location, $uibModalInstance, $routeParams, $q, common, client) {
        var log = common.logger;

        $scope.client = new lhc.models.client();
        $scope.client = client || $scope.client;
        
        $scope.save = function () {
            $uibModalInstance.close($scope.client);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    };


})();