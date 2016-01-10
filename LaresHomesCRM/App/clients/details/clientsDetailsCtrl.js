(function () {

    'use strict';

    var controllerId = 'ClientDetails';
    angular.module('app').controller(controllerId, ['$scope', '$location', '$routeParams', '$modal', 'common', 'datacontext', clientDetails]);

    function clientDetails($scope, $location, $routeParams, $modal, common, datacontext) {

        $scope.clientId = +$routeParams.id;

        // init controller
        function init() {
            if ($scope.clientId) {
                getClientById($scope.clientId);
            };

            $scope.select('contracts');

            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        $scope.select = function (value) {
            $scope.selectedTab = value;
        };

        var getClientById = function (clientId) {
            datacontext.getClient(clientId)
                .then(function (data) {
                    $scope.client = data;
                    //common.logger.logDebug('getClient', $scope, controllerId);
                }, function (error) {
                    common.logger.logError('getClientById', error, controllerId);
                });
        };

        // init controller
        init();

    };

})();