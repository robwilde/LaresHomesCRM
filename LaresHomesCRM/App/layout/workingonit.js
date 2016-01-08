(function () {
    'use strict';

    // define controller
    var controllerId = 'workingonit';
    angular.module('app').controller(controllerId,
      ['$rootScope', 'common', 'config', workingonit]);

    function workingonit($rootScope, common, config) {
        var vm = this;

        vm.isWorking = false;

        init();

        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        //common.logger.logDebug('$rootscope', $rootScope, controllerId);

        $rootScope.$on(config.events.workingOnItToggle,
            function (event, data) {
                common.logger.logDebug('toggle working on it', data, controllerId);
                vm.isWorking = data.show;
            });

        $rootScope.$on('$routeChangeStart',
          function (event, next, current) {
              //common.logger.logDebug('$routeChangeStart - event', event, controllerId);
              vm.isWorking = true;
          });

        // wire handler when route is finished changing to hide
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            //common.logger.logDebug('$routeChangeSuccess - event', event, controllerId);
            vm.isWorking = false;
        });

    }
})();