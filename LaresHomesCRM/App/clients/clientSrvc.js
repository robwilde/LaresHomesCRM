(function () {
    'use strict';

    // define factory
    var serviceId = 'clientSrvc';
    angular.module('app').factory(serviceId,
	  ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', 'datacontext', 'documentSrvc', clientService]);


    function clientService($rootScope, $http, $resource, $q, config, common, spContext, datacontext, documentSrvc) {

        // init factory
        function init() {
            common.logger.log('service loaded', null, serviceId);
        }

        init();

        var log = common.logger;

        var listName = "Clients";
        var clientUrl = "_api/web/lists/getbytitle(\'Clients\')/items";

        // service signature
        return {
            listName: listName,
            getClientById: getClientById,
            getClients: getClients,
            saveClient: saveClient,
            deleteClient: deleteClient
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

        function getClients() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + '?$select=Id,Title,ClientsFirstName,ClientsLastName,ClientsPhone,ClientsEmail,ClientsProjectStatus&$orderby=ClientsLastName'
            })
            .success(function (data) {
                //common.logger.logDebug('Client details via ngHTTP - OK', data, 'clientService.getClients');
                deferred.resolve(data.d.results);
            })
            .error(function (error) {
                log.logError('getClients - ERROR', error, serviceId);
                deferred.reject(error);
            });
            return deferred.promise;
        }

        // deletes a learning path
        function deleteClient(client) {
            // get resource
            var resource = datacontext.getClientResource(client);
            var deferred = $q.defer();

            // use angular $resource to delete the item
            resource.delete(client, function (data) {
                deferred.resolve(data);
                log.logDebug("deleteClient", data, serviceId);
            }, function (error) {
                deferred.reject(error);
                log.logError("deleteClient", error, serviceId);
            });

            return deferred.promise;
        }

        // saves a client
        function saveClient(client) {
            // get resource
            var resource = datacontext.getClientResource(client);
            var deferred = $q.defer();

            resource.save(client, function (data) {

                var client = data.d;
                addDocList(client);

                deferred.resolve(client);
                log.logDebug("saveClient", client, serviceId);
            }, function (error) {
                deferred.reject(error);
                log.logError("Save client", error, serviceId);
            });

            return deferred.promise;

        };

        // create the doc libaries for new clients
        function addDocList(client) {
            // libraryName must not start with a number and undescore. Exceptions occur when libraries are created in sequence
            var firstInitial = client.ClientsFirstName.charAt(0).toUpperCase();
            var clientFullName = client.ClientsLastName + firstInitial;
            var docLibs = {};

            // create the email libary
            var emailLibraryName = clientFullName + '_Emails';
            var emailLibary = documentSrvc.addDocLibrary(emailLibraryName, "emails", true);
            log.logDebug('emailLibary', emailLibary, serviceId);

            var docLibaries = ['Contracts', 'Selections', 'Construction'];
            for (var i = 0; i < docLibaries.length; i++) {
                var libName = docLibaries[i];

                var docLibraryName = clientFullName + '_' + libName;
                docLibs[libName] = documentSrvc.addDocLibrary(docLibraryName, libName, true);
            }
        };

    }

})();