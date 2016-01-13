(function () {
    'use strict';

    // define factory
    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
      ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', datacontext]);

    function datacontext($rootScope, $http, $resource, $q, config, common, spContext) {
        var log = common.logger;

        // init factory
        init();

        // service public signature
        return {
            getClientResource: getClientResource
        };

        // init service
        function init() {
            log.Info("service loaded", null, serviceId);
        }

        function getClientResource(item) {
            return getResourceForList("Clients", item);
        }

        function getListResource(listName, item) {
            var url = "_api/web/lists/" + listName + "/items";
            if (item && item.Id) {
                url += "(" + item.Id + ")";
            }
            return getResource(url);
        }

        function getResourceForList(listTitle, item) {
            var url = "_api/web/lists/getbytitle('" + listTitle + "')/items";
            if (item.Id) {
                url += "(" + item.Id + ")";
            }
            return getResource(url);
        }


        function getResource(url) {
            var requestDigest = spContext.securityValidation;
            return $resource(url, {},
            {
                save: {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose;',
                        'Content-Type': 'application/json;odata=verbose;',
                        'X-RequestDigest': requestDigest
                    }
                },
                remove: {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose;',
                        'Content-Type': 'application/json;odata=verbose;',
                        'X-RequestDigest': requestDigest,
                        'If-Match': "*",
                        'X-HTTP-Method': "DELETE",
                    }
                },
                update: {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose;',
                        'Content-Type': 'application/json;odata=verbose;',
                        'X-RequestDigest': requestDigest,
                        'If-Match': "*",
                        'X-HTTP-Method': "MERGE",
                    }
                }
            });
        }


    }
})();
