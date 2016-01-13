(function () {
    'use strict';

    // define controller
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId,
      ['common', dashboard]);

    // init controller
    function dashboard(common) {
        var vm = this;
        var log = common.logger;

        // init controller
        init();

        // init controller
        function init() {
            log.Info("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

    }
})();