(function () {

    'use strict';

    var controllerId = 'ClientDetails';
    angular.module('app').controller(controllerId, ['$scope', '$location', '$routeParams', '$uibModal', '$q', 'common', 'datacontext', 'clientSrvc', clientDetails]);

    function clientDetails($scope, $location, $routeParams, $uibModal, $q, common, datacontext, clientSrvc) {
        var log = common.logger;

        $scope.showSpinner = false;
        $scope.clientId = +$routeParams.id;

        var clientModel = new lhc.models.client();
        // init controller
        function init() {
            if ($scope.clientId) {
                getClientById($scope.clientId);
            };

            $scope.select('contracts');

            log.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        $scope.select = function (value) {
            $scope.selectedTab = value;
        };

        // get the client details by the ID
        var getClientById = function (clientId) {
            clientSrvc.getClientById(clientId)
                .then(function (data) {
                    $scope.client = data;
                    log.logDebug('getClient', $scope, controllerId);
                }, function (error) {
                    log.logError('getClientById', error, controllerId);
                });
        };

        // delete client from details page
        // @TODO: need to look at delteing the docs only if they are empty
        $scope.deleteClient = function () {
            if (confirm("Are you sure?")) {
                clientSrvc.deleteClient($scope.client)
                    .then(function () {
                        //common.logger.logDebug("Deleted Client.", null, controllerId);
                        $location.path('/Clients/');
                    }, function (error) {
                        common.logger.logError('65 - ERROR', error, 'client-details-directive.deleteClient');
                    });
            }
            //TODO: delete related projects
        }

        // form update from the modal 
        $scope.editClientForm = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/clients/form/client-form.html',
                controller: 'ClientFormCtrl',
                resolve: {
                    client: function () {
                        return $scope.client;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $scope.showSpinner = true;
                log.logDebug("data - 55", data, controllerId + '.modalInstance');

                for (var i in data) {
                    //common.logger.logDebug('data - 35', data, 'addEditClient.isEdit');
                    if (clientModel.hasOwnProperty(i)) {
                        clientModel[i] = data[i];
                    }
                }



                updateClient(clientModel)
                .then(function (data) {
                    $scope.client = data;
                    $scope.showSpinner = false;
                });
            }, function (error) {
                log.logError('ERROR', error, controllerId);
            });
        };

        // update the current client data and reload the details info
        function updateClient(client) {
            log.logDebug("client - 79", client, controllerId + '.updateClient');

            var deferred = $q.defer();
            var resource = datacontext.getClientResource(client);
            
            resource.update(client, function (data) {
                log.logDebug("data", data, controllerId + '.updateClient');
                deferred.resolve(data);
            }, function (error) {
                log.logError("save client - ERROR", error, controllerId + '.updateClient');
                deferred.reject(error);
            });

            return deferred.promise;
        };

        // init controller
        init();

    };

})();