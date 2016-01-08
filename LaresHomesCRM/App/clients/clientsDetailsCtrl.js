(function () {

    'use strict';

    var controllerId = 'clientDetails';
    angular.module('app').controller(controllerId, ['$window', '$location', '$routeParams', 'common', 'datacontext', clientDetails]);

    function clientDetails($window, $location, $routeParams, common, datacontext) {
        var ClientCtrl = this;

        // init controller
        init();

        // get Client Details

        // init controller
        function init() {
            var clientId = +$routeParams.id;
            if (clientId && clientId > 0) {
                getClient(clientId);
            }

            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        function getClient(clientId) {
            datacontext.getClient(clientId)
            .then(function (data) {
                ClientCtrl.client = data;
                common.logger.logDebug('getClient', ClientCtrl, controllerId);
            })
        }

    };


})();