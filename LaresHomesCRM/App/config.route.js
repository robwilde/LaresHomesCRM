(function () {
    'use strict';

    var app = angular.module('app');

    // get all the routes
    app.constant('routes', getRoutes());

    // config routes & their resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);

    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (route) {
            $routeProvider.when(route.url, route.config);
        });

        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // build the routes
    function getRoutes() {
        return [
          {
              url: '/',
              config: {
                  templateUrl: 'app/dashboard/dashboard.html',
                  title: 'dashboard',
                  settings: {
                      nav: 0,
                      content: 'dashboard',
                      quickLaunchEnabled: false
                  }
              }
          },
          {
              url: '/Clients',
              config: {
                  templateUrl: 'app/clients/clients-dashboard.html',
                  title: 'Client List',
                  settings: {
                      nav: 1,
                      content: 'Clients',
                      quickLaunchEnabled: true
                  }
              }
          },
            {
                url: '/Clients/:id',
                config: {
                    templateUrl: 'app/clients/clients-details.html',
                    title: 'Client Details',
                    settings: {
                        nav: 1,
                        content: 'Client Details',
                        quickLaunchEnabled: false
                    }
                }
            }

        ];
    }
})();