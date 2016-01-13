(function () {

    'use strict';

    var controllerId = 'ClientTabsCtrl';
    angular.module('app').controller(controllerId,
        ['$scope', '$routeParams', '$q', 'common', 'clientSrvc', 'documentSrvc', 'usSpinnerService', tabCtrl]);

    function tabCtrl($scope, $routeParams, $q, common, clientSrvc, documentSrvc, usSpinnerService) {
        //var vm = this;

        $scope.showSpinner = false;

        var log = common.logger;
        var clientId = +$routeParams.id;
        var clientNameId;


        $scope.Tabs = [
            {
                name: "Contracts"
            },
            {
                name: "Selections"
            },
            {
                name: "Construction"
            }
        ];
        log.Debug('$scope.Tabs', $scope.Tabs, controllerId);

        var activeTab = $scope.Tabs[0].name;

        // init controller
        init();

        // init controller
        function init() {

            // get the ClientName ID for the doc libaries
            if (clientId) {
                $scope.showSpinner = true;

                clientSrvc.getClientNameId(clientId)
                .then(function (data) {
                    clientNameId = data;

                    $scope.getTabData();
                });
            }

            log.Info("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        };

        // function to get the documents based on the tab selected
        $scope.getTabData = function (docType) {
            var docType = docType || activeTab;

            if (clientNameId) {
                var docLibName = clientNameId + '_' + docType;
                getClientDocs(clientId, docLibName)
                .then(function (data) {
                
                    $scope.tabDocs = data;
                    log.Debug('$scope.tabDocs - 76', $scope.tabDocs, controllerId + '.getTabData');
                    $scope.showSpinner = false;

                }, function () {
                    log.Error('ERROR', error, controllerId);
                });
            }

        };

        // get the docs for the current Libary Tab
        function getClientDocs(clientId, docLibName) {
            var deferred = $q.defer();

            documentSrvc.getDocuments(clientId, docLibName)
            .then(function (data) {
                log.Debug('Libary Docs - 92', data, controllerId);
                deferred.resolve(data);
            }, function (error) {
                log.Error('ERROR', error, controllerId + '.getTabData');
                deferred.reject(error);
            });

            return deferred.promise;
        }

    };

})();