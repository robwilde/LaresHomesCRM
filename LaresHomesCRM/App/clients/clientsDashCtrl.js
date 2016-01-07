(function () {

    'use strict';

    var controllerId = 'clientsDashCtrl';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', clientsDashboard]);

    function clientsDashboard($location, common, datacontext) {
        var DashCtrl = this;

        // init controller
        init();

        // get all the clients
        getClients();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        //common.logger.logError('Checking DashCtrl', DashCtrl, controllerId);

        // get clients & set to bindable collection on vm
        function getClients() {
            datacontext.getClientsPartials()
              .then(function (data) {
                  if (data) {
                      DashCtrl.clients = data;
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