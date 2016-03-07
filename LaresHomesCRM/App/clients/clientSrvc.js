(function () {
    'use strict';

    // define factory
    var serviceId = 'clientSrvc';
    angular.module('app').factory(serviceId,
	  ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', 'datacontext', 'documentSrvc', clientService]);


    function clientService($rootScope, $http, $resource, $q, config, common, spContext, datacontext, documentSrvc) {
        var log = common.logger;

        // init factory
        function init() {
            log.Info('service loaded', null, serviceId);
        }

        init();

        var listName = "Clients";
        var clientUrl = "_api/web/lists/getbytitle(\'Clients\')/items";

        // service signature
        return {
            listName: listName,
            getClientById: getClientById,
            getClientNameId: getClientNameId,
            getClients: getClients,
            saveClient: saveClient,
            deleteClient: deleteClient
        };

        function formatTitleFilter(value) {
            return "?$filter=substringof('" + value + "', Title)";
        }

        // get client byID return singal result
        function getClientById(id) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: clientUrl + "(" + id + ")"
            })
            .then(function (response) {
                //log.Debug('data - 46', data, serviceId + '.getClientById');
                deferred.resolve(response.data.d);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // get all clients listed
        function getClients() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: clientUrl + '?$select=Id,Title,ClientsFirstName,ClientsLastName,ClientsPhone,ClientsEmail,ClientsProjectStatus&$orderby=ClientsLastName'
            })
            .success(function (data) {
                log.Debug('data - 62', data, serviceId + '.getClients');
                deferred.resolve(data.d.results);
            })
            .error(function (error) {
                log.Error('getClients - ERROR', error, serviceId);
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
            resource.remove(client, function (data) {
                deferred.resolve(data);
                log.Debug("deleteClient", data, serviceId);
            }, function (error) {
                deferred.reject(error);
                log.Error("deleteClient", error, serviceId);
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
                log.Debug("saveClient", client, serviceId);
            }, function (error) {
                deferred.reject(error);
                log.Error("Save client", error, serviceId);
            });

            return deferred.promise;

        };


        // return the clientName ID LastName First Initial
        function getClientNameId(clientId) {
            var deffered = $q.defer();

            getClientById(clientId)
            .then(function (data) {
                var clientNameId = setClientNameId(data);
                log.Debug('data - 122', data, serviceId + '.getClientNameId');

                deffered.resolve(clientNameId);
            }, function (error) {
                log.Error('ERROR', error, serviceId + '.getClientNameId');
            });

            return deffered.promise;
        }

        // user LastName and First Intial to create docLib ID
        function setClientNameId(client) {
            var firstInitial = client.ClientsFirstName.charAt(0).toUpperCase();
            var clientNameId = 'LH' + client.ClientJobNumber + '_' + client.ClientsLastName + firstInitial;

            return clientNameId;
        }

        // create the doc libaries for new clients
        function addDocList(client) {
            // libraryName must not start with a number and undescore. 
            // Exceptions occur when libraries are created in sequence
            log.Debug('Client - 142', client, serviceId + '.addDocList');
            var clientNameId = setClientNameId(client);
            var docLibs = {};

            // create the email libary
            var emailLibraryName = clientNameId + '_Emails';
            documentSrvc.addDocLibrary(emailLibraryName, "emails", true)
            .then(function (data) {
                log.Debug('data', data, serviceId + '.addEmailLibary');

                // bind the contentType for OnePlace Mail to the doc libary
                var contentTypeId = '0x0101002EFF4F6709F446E5AD064DC20BBE6855';
                documentSrvc.bindContentTypeToLibrary(emailLibraryName, contentTypeId, true)
                .then(function (data) {
                    log.Debug('data', data, serviceId + '.bindContentTypeToLibrary');
                }, function (error) {
                    log.Error('ERROR', error, serviceId);
                });

            }, function (error) {
                log.Error('ERROR', error, serviceId);
            });

            var docLibaries = ['Contracts', 'Selections', 'Construction'];
            for (var i = 0; i < docLibaries.length; i++) {
                var libName = docLibaries[i];

                //var docLibraryName = 'LH' + client.ClientJobNumber + '_' + clientNameId + '_' + libName;
                var docLibraryName = clientNameId + '_' + libName;

                docLibs[libName] = documentSrvc.addDocLibrary(docLibraryName, libName, true);
            }
        };

    }

})();