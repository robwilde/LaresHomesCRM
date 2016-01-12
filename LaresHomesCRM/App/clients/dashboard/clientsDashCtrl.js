(function () {

    'use strict';

    var controllerId = 'clientsDashCtrl';
    angular.module('app').controller(controllerId, ['$scope', '$uibModal', '$location', 'common', 'clientSrvc', 'usSpinnerService', clientsDashboard]);

    function clientsDashboard($scope, $uibModal, $location, common, clientSrvc, usSpinnerService) {
        var log = common.logger;
        $scope.showSpinner = false;
        $scope.goToClient = goToClient;

        $scope.clientTabs = [
            { status: "In-Progress" },
            { status: "Pending" },
            { status: "On-Hold" },
            { status: "Completed" }
        ];

        log.logDebug('clientTabs', $scope.clientTabs, controllerId);

        // init controller
        init();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);

            // get all the clients
            getClients();
        }

        var setDocName = function (str) {
            var strUp = str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            var strArray = strUp.split(" ", 2);

            return strArray[0] + strArray[1];
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
                templateUrl: 'app/clients/form/client-form.html',
                controller: 'ClientFormCtrl',
                resolve: {
                    id: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                //log.logDebug('modalInstance Result', data, controllerId);
                saveClient(data);
            }, function () {

            });
        };

        /*get clients & set to bindable collection on vm*/
        function getClients() {
            clientSrvc.getClients()
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

        /*save client from the add/edit modal window*/
        function saveClient(client) {

            $scope.showSpinner = true;

            clientSrvc.saveClient(client)
            .then(function (data) {
                var item = data;
                //log.logDebug('saveClient - item', item, controllerId);

                var newClient = {
                    Id: item.Id,
                    ClientsFirstName: item.ClientsFirstName,
                    ClientsLastName: item.ClientsLastName,
                    ClientsPhone: item.ClientsPhone,
                    ClientsEmail: item.ClientsEmail,
                    ClientsProjectStatus: item.ClientsProjectStatus
                }

                $scope.Clients.push(newClient);
                $scope.showSpinner = false;
                //log.logDebug('saveClient - $scope', $scope, controllerId);

            }, function (error) {
                log.logError('saveClient ERROR', error, controllerId);
            });
        }


    };


})();