(function () {

    'use strict';

    var controllerId = 'ClientDetails';
    angular.module('app').controller(controllerId, ['$scope', '$location', '$routeParams', '$uibModal', '$q', 'dialog', 'common', 'datacontext', 'clientSrvc', clientDetails]);

    function clientDetails($scope, $location, $routeParams, $uibModal, $q, dialog, common, datacontext, clientSrvc) {
        var log = common.logger;

        $scope.clientId = +$routeParams.id;

        var clientModel = new lhc.models.client();
        // init controller
        function init() {
            if ($scope.clientId) {
                getClientById($scope.clientId);
            };

            $scope.select('contracts');

            log.Info("controller loaded", null, controllerId);
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
                    log.Debug('getClient', $scope, controllerId);
                }, function (error) {
                    log.Error('getClientById', error, controllerId);
                });
        };


        // delete client from details page
        $scope.deleteClient = function (text) {
            dialog.confirm(text)
              .then(function () {
                  clientSrvc.deleteClient($scope.client)
                      .then(function () {
                          //log.Debug("Deleted Client.", null, controllerId);
                          $location.path('/Clients/');
                      }, function (error) {
                          log.Error('65 - ERROR', error, controllerId + '.deleteClient');
                      });
              })
              .catch(function (error) {
                  log.Error('55 - declined', error, controllerId + '.deleteClient');
              })
        };


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
                //$scope.showSpinner = true;
                log.Debug("data - 55", data, controllerId + '.modalInstance');

                for (var i in data) {
                    //log.Debug('data - 35', data, 'addEditClient.isEdit');
                    if (clientModel.hasOwnProperty(i)) {
                        clientModel[i] = data[i];
                    }
                }



                updateClient(clientModel)
                .then(function (data) {
                    $scope.client = data;
                    //$scope.showSpinner = false;
                });
            }, function (error) {
                log.Error('ERROR', error, controllerId);
            });
        };

        // update the current client data and reload the details info
        function updateClient(client) {
            log.Debug("client - 79", client, controllerId + '.updateClient');

            var deferred = $q.defer();
            var resource = datacontext.getClientResource(client);

            resource.update(client, function (data) {
                log.Debug("data", data, controllerId + '.updateClient');
                deferred.resolve(data);
            }, function (error) {
                log.Error("save client - ERROR", error, controllerId + '.updateClient');
                deferred.reject(error);
            });

            return deferred.promise;
        };

        // init controller
        init();

    };

})();