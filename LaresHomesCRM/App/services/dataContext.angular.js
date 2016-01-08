/*
 * datacontext that uses the Anuglar $http service
 */

(function () {
    'use strict';

    // define factory
    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
      ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', datacontext]);

    function datacontext($rootScope, $http, $resource, $q, config, common, spContext) {
        // init factory
        init();

        // service public signature
        return {
            getClientsPartials: getClientsPartials,
            getClient: getClient,
            createClient: createClient,
            saveClient: saveClient,
            deleteClient: deleteClient,
        };

        // init service
        function init() {
            common.logger.log("service loaded", null, serviceId);
        }

        // get the Client angular resource reference
        function getClientResource(currentItem) {
            // if an ID is passed in, 
            //   ELSE create resource pointing to collection for a new item
            if (+currentItem.Id) {
                //   THEN build the resource to the specific item
                return $resource('_api/web/lists/getbytitle(\'Clients\')/items(:itemId)',
                { itemId: currentItem.Id },
                {
                    get: {
                        method: 'GET',
                        params: {
                            '$select': 'Id,Title,ClientsFirstName,ClientsLastName,ClientsPhone,ClientsEmail,ClientsAddress,ClientsSuburb,ClientsCity,ClientsPostcode,ClientsProjectStatus,ClientsNotes,Created,Modified'
                        },
                        headers: {
                            'Accept': 'application/json;odata=verbose;'
                        }
                    },
                    post: {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json;odata=verbose;',
                            'Content-Type': 'application/json;odata=verbose;',
                            'X-RequestDigest': spContext.securityValidation,
                            'X-HTTP-Method': 'MERGE',
                            'If-Match': currentItem.__metadata.etag
                        }
                    },
                    delete: {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json;odata=verbose;',
                            'Content-Type': 'application/json;odata=verbose;',
                            'X-RequestDigest': spContext.securityValidation,
                            'If-Match': '*'
                        }
                    }
                });
            } else {
                return $resource('_api/web/lists/getbytitle(\'Clients\')/items',
                  {},
                  {
                      post: {
                          method: 'POST',
                          headers: {
                              'Accept': 'application/json;odata=verbose;',
                              'Content-Type': 'application/json;odata=verbose;',
                              'X-RequestDigest': spContext.securityValidation
                          }
                      }
                  });
            }
        }


        // retrieve all learning paths, using ngHttp service
        function getClientsPartials() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '_api/web/lists/getbytitle(\'Clients\')/items?$select=Id,Title,ClientsFirstName,ClientsLastName,ClientsPhone,ClientsEmail,ClientsProjectStatus&$orderby=ClientsLastName'
            }).success(function (data) {
                common.logger.logDebug("getClientsPartials", data, serviceId);
                deferred.resolve(data.d.results);
            }).error(function (error) {
                common.logger.logError('getClientsPartials', error, serviceId);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // gets a specific client
        function getClient(id) {
            var client = new lhc.models.client();
            client.Id = id;

            // get resource
            var resource = getClientResource(client);

            var deferred = $q.defer();
            resource.get({}, function (data) {
                deferred.resolve(data.d);
                common.logger.logDebug("getClient", data, serviceId);
            }, function (error) {
                deferred.reject(error);
                common.logger.logError("getClient", error, serviceId);
            });

            return deferred.promise;
        }

        // creates a new client
        function createClient() {
            return new lhc.models.client();
        }

        // saves a client
        function saveClient(client) {
            // get resource
            var resource = getClientResource(client);

            var deferred = $q.defer();

            resource.post(client, function (data) {
                deferred.resolve(data);
                common.logger.logDebug("saveClient", data, serviceId);
            }, function (error) {
                deferred.reject(error);
                common.logger.logError("Save client", error, serviceId);
            });

            return deferred.promise;

        }

        // deletes a learning path
        function deleteClient(client) {
            // get resource
            var resource = getClientResource(client);
            var deferred = $q.defer();

            // use angular $resource to delete the item
            resource.delete(client, function (data) {
                deferred.resolve(data);
                common.logger.logDebug("deleteClient", data, serviceId);
            }, function (error) {
                deferred.reject(error);
                common.logger.logError("deleteClient", error, serviceId);
            });

            return deferred.promise;
        }

    }
})();