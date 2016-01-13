(function () {
    'use strict';

    // define service
    var serviceId = 'angular.config';
    angular.module('app').factory(serviceId,
      ['$http', 'common', configAngular]);

    function configAngular($http, common) {
        var log = common.logger;
        // init factory
        init();

        // service public signature
        return {};

        // init factory
        function init() {
            // set common $http headers
            $http.defaults.headers.common.Accept = 'application/json;odata=verbose;';

            log.Info("service loaded", null, serviceId);
        }
    }

})();