(function () {
    'use strict';

    // define controller
    var controllerId = 'workingonit';
    angular.module('app').controller(controllerId,
      ['$rootScope', 'common', 'config', workingonit]);

    function workingonit($rootScope, common, config) {
        var vm = this;
        var log = common.logger;

        vm.isWorking = false;

        init();

        function init() {
            log.Info("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        //log.Debug('$rootscope', $rootScope, controllerId);

        $rootScope.$on(config.events.workingOnItToggle,
            function (event, data) {
                log.Debug('toggle working on it', data, controllerId);
                vm.isWorking = data.show;
            });

        $rootScope.$on('$routeChangeStart',
          function (event, next, current) {
              //log.Debug('$routeChangeStart - event', event, controllerId);
              vm.isWorking = true;
          });

        // wire handler when route is finished changing to hide
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            //log.Debug('$routeChangeSuccess - event', event, controllerId);
            vm.isWorking = false;
        });

    }
})();