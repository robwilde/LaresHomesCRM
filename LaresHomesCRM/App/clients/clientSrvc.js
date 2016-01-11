(function () {
    'use strict';

    // define factory
    var serviceId = 'clientService';
    angular.module('app').factory(serviceId,
	  ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', 'datacontext', clientService]);


    function clientService($rootScope, $http, $resource, $q, config, common, spContext, datacontext) {

        // init factory
        function init() {
            common.logger.log('service loaded', null, serviceId);
        }

        init();

        var listName = "Client List";
        var clientUrl = "_api/web/lists/getbytitle(\'Clients\')/items";

        // service signature
        return {
            listName: listName,
            getClientById: getClientById,
            getClientTitleById: getClientTitleById,
            getClients: getClients,
            getClientsTitles: getClientsTitles,
            getClientsByTitleSearch: getClientsByTitleSearch,
            saveClient: saveClient,
            deleteClient: deleteClient,
            checkClient: checkClient
        };

        function formatTitleFilter(value) {
            return "?$filter=substringof('" + value + "', Title)";
        }

        function getClientById(id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + "(" + id + ")"
            })
            .success(function (data) {
                deferred.resolve(data.d);
            })
            .error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getClientTitleById(id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + "(" + id + ")?$select=Id,Title"
            })
            .success(function (data) {
                deferred.resolve(data.d);
            })
            .error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getClients() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + "?$selected=Id,Title,phone,email,ContactName,ContactEmail,AccountManager&$orderby=Title",
            })
            .success(function (data) {
                //common.logger.logDebug('Client details via ngHTTP - OK', data, 'clientService.getClients');
                deferred.resolve(data.d.results);
            })
            .error(function (error) {
                common.logger.logError('Client Details via ngHTTP - ERROR', error, 'clientService.getClients');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getClientsTitles() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + "?$select=Id,Title",
            })
            .success(function (data) {
                //common.logger.logDebug('retireived the Client details via ngHTTP', data, 'clientService.getClientsTitles');
                deferred.resolve(data.d.results);
            })
            .error(function (error) {
                common.logger.logError('97 - ERROR', error, 'clientService.getClientsTitles');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getClientsByTitleSearch(value) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + formatTitleFilter(value)
            })
            .success(function (data) {
                //common.logger.logDebug('Get Clients By Title - OK', data, 'clientService.getClientsByTitleSearch');
                deferred.resolve(data.d.results);
            })
            .error(function (error) {
                common.logger.logError('Get Clients By Title - ERROR', Error, 'clientService.getClientsByTitleSearch');

                deferred.reject(error);
            });
            return deferred.promise;
        }

        function deleteClient(client) {
            var resource = datacontext.getClientResource(client);
            var deferred = $q.defer();
            resource.remove(client, function () {
                auditService.writeAudit("client", client.Id, "", null, client);

                common.logger.logDebug("delete client - OK", client, 'clientService.deleteClient');

                deferred.resolve();
            }, function (error) {
                common.logger.logError("delete client - ERROR", error, 'clientService.deleteClient');

                deferred.reject(error);
            });
            return deferred.promise;
        }

        function checkClient(client) {
            var deferred = $q.defer();
            getClientsTitles().then(function (data) {
                var isOk = true;
                var clients = data;
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].Title == client.Title && clients[i].Id != client.Id) {
                        isOk = false;
                    }
                }
                deferred.resolve(isOk);
            });
            return deferred.promise;
        }

        function saveClient(client, originalData) {

            var deferred = $q.defer();

            checkClient(client)
                .then(function (isOk) {
                    if (isOk) {
                        var resource = datacontext.getClientResource(client);
                        if (client.Id) {
                            resource.update(client, function () {
                                auditService.writeAudit("client", client.Id, "", client, originalData);
                                common.logger.logDebug("save client - OK", client, 'clientService.saveClient.update');

                                deferred.resolve(client);
                            }, function (error) {
                                common.logger.logError("save client - ERROR", error, 'clientService.saveClient.update');

                                deferred.reject(error);
                            });
                        }
                        else {
                            resource.save(client, function (data) {
                                client.Id = data.d.Id;
                                auditService.writeAudit("client", client.Id, "", client, null);

                                common.logger.logDebug("save client - OK", data, 'clientService.saveClient.save');
                                deferred.resolve(data.d);
                            }, function (error) {
                                common.logger.logError("save client - ERROR", error, 'clientService.saveClient.save');

                                deferred.reject(error);
                            });
                        }
                    }
                    else {
                        deferred.reject("Client with same Title already exists!");
                    }
                });
            return deferred.promise;
        }

    }

})();