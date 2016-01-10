(function () {

    'use strict';

    var controllerId = 'clientsDashCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$uibModal', '$location', 'common', 'datacontext', clientsDashboard]);

    function clientsDashboard($scope, $uibModal, $location, common, datacontext) {
        var vm = this;
        $scope.goToClient = goToClient;

        // init controller
        init();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);

            // get all the clients
            getClients();
        }

        // navigate to specified client
        function goToClient(client) {
            //common.logger.logDebug('goToClient', client, controllerId);
            if (client && client.Id) {
                $location.path('/Clients/' + client.Id);
            }
        }

        $scope.newClientForm = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/clients/client-form.html',
                controller: 'ClientFormCtrl',
                resolve: {
                    id: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.Clients.push(data);
                //updateClientManagers();
            }, function () {
            });
        };

        // get clients & set to bindable collection on vm
        function getClients () {
            datacontext.getClientsPartials()
              .then(function (data) {
                  if (data) {
                      //common.logger.logDebug('getClients', data, controllerId);
                      $scope.Clients = data;
                  } else {
                      throw new Error('error obtaining data');
                  }
              })
              .catch(function (error) {
                  common.logger.logError('getClients', error, controllerId);
              });
        }

    };


})();