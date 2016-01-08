(function () {

    'use strict';

    var controllerId = 'clientsDashCtrl';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', clientsDashboard]);

    function clientsDashboard($location, common, datacontext) {
        var DashCtrl = this;

        DashCtrl.goToClient = goToClient;

        // init controller
        init();

        // get all the clients
        getClients();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        // navigate to specified client
        function goToClient(client) {
            common.logger.logDebug('goToClient', client, controllerId);
            if (client && client.Id) {
                $location.path('/Clients/' + client.Id);
            }
        }

        //common.logger.logError('Checking DashCtrl', DashCtrl, controllerId);

        // get clients & set to bindable collection on vm
        function getClients() {
            datacontext.getClientsPartials()
              .then(function (data) {
                  if (data) {
                      //common.logger.logDebug('getClients', data, controllerId);

                      DashCtrl.Clients = data;
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