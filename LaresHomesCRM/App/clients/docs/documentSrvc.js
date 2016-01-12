(function () {
    'use strict';

    // define factory
    var serviceId = 'documentSrvc';
    angular.module('app').factory(serviceId,
	  ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', 'datacontext', documentService]);


    function documentService($rootScope, $http, $resource, $q, config, common, spContext, datacontext) {

        var clients = {};
        var log = common.logger;

        // init factory
        function init() {
            common.logger.log('service loaded', null, serviceId);
        }

        init();

        var documentUrl = "_api/web/lists";
        var clientDocumentsUrl = "_api/web/lists/getbytitle(\'placeholder\')/items";

        return {
            addDocLibrary: addDocLibrary,
            getDocuments: getDocuments,
            getRequestDigest: getRequestDigest,
            bindContentTypeToLibrary: bindContentTypeToLibrary,
            deleteContentTypeFromLibrary: deleteContentTypeFromLibrary,
            getContentTypesFromLibrary: getContentTypesFromLibrary,
            addRequestExecuterContext: addRequestExecuterContext
        };

        function getRequestDigest() {
            return spContext.securityValidation;
        }

        // add a NEW doc libary 
        function addDocLibrary(docLibaryName, docLibaryType, loadFromHostWeb) {
            var deferred = $q.defer();
            var requestDigest = spContext.securityValidation;
            var url = addRequestExecuterContext(loadFromHostWeb, documentUrl, spContext.hostWeb.url);

            var req = {
                method: 'POST',
                url: url,
                headers: {
                    'accept': 'application/json;odata=verbose',
                    'content-type': 'application/json;odata=verbose',
                    'X-RequestDigest': requestDigest
                },
                data: JSON.stringify({
                    '__metadata': { 'type': 'SP.List' }, 'AllowContentTypes': true, 'BaseTemplate': 101,
                    'ContentTypesEnabled': true, 'Description': docLibaryType, 'Title': docLibaryName
                })
            }


            $http(req).then(function (data) {
                log.logDebug('data', data, serviceId + '.addDocLibrary');

                deferred.resolve(data);
            }, function (error) {
                log.logError('ERROR', error, serviceId + '.addDocLibrary');
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // get the content from the docuemnt library
        function bindContentTypeToLibrary(docLibraryName, contentTypeId, loadFromHostWeb) {
            var deferred = $q.defer();

            var url = "_api/web/lists/getbytitle(\'" + docLibraryName + "\')/ContentTypes/AddAvailableContentType";
            common.logger.logDebug('URL - 72', url, serviceId + '.bindContentTypeToLibrary');

            var requestDigest = spContext.securityValidation;

            url = addRequestExecuterContext(loadFromHostWeb, url, spContext.hostWeb.url);

            var req = {
                method: 'POST',
                url: url,
                headers: {
                    'accept': 'application/json;odata=verbose',
                    'content-type': 'application/json;odata=verbose',
                    'X-RequestDigest': requestDigest
                },
                data: JSON.stringify({
                    'contentTypeId': contentTypeId
                })
            }

            $http(req).then(function (data) {
                common.logger.logDebug('Bind contentType to library - 90', data, serviceId + '.bindContentTypeToLibrary');
                deferred.resolve(data.d.results);
            }, function (error) {
                common.logger.logError('Bind contentType to library - 94 - ERROR', error, serviceId + '.bindContentTypeToLibrary');
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // delete content from the document libary
        function deleteContentTypeFromLibrary(docLibraryName, contentTypeId, loadFromHostWeb) {
            var deferred = $q.defer();

            var url = "_api/web/lists/getbytitle(\'" + docLibraryName + "\')/ContentTypes/getbyid('" + contentTypeId + "')";
            var requestDigest = spContext.securityValidation;

            url = addRequestExecuterContext(loadFromHostWeb, url, spContext.hostWeb.url);

            $.ajax({
                url: url,
                method: 'POST',
                headers: {
                    'accept': 'application/json;odata=verbose',
                    'content-type': 'application/json;odata=verbose',
                    'X-RequestDigest': requestDigest,
                    "X-Http-Method": "DELETE", "x-requestforceauthentication": true, "If-Match": "*",  // specific for delete op     
                },
                success: function (data) {
                    common.logger.logDebug('Delete contenttype from library - 121', data, serviceId + '.deleteContentTypeFromLibrary');
                    deferred.resolve(data);
                },
                error: function (error) {
                    common.logger.logError('Delete contenttype from library - 125 - ERROR', error, serviceId + '.deleteContentTypeFromLibrary');
                    deferred.reject(error);
                }
            });
            return deferred.promise;
        }

        // get teh content types from the document libary
        function getContentTypesFromLibrary(docLibraryName, loadFromHostWeb) {
            var deferred = $q.defer();

            var url = "_api/web/lists/getbytitle(\'" + docLibraryName + "\')/ContentTypes";
            var requestDigest = spContext.securityValidation;

            url = addRequestExecuterContext(loadFromHostWeb, url, spContext.hostWeb.url);

            $http({
                method: 'GET',
                url: url
            })
            .then(function (response) {
                common.logger.logDebug('Get contenttype from library - OK - 145', response, serviceId + '.getContentTypesFromLibrary');
                deferred.resolve(response.data.d.results);
            }, function (error) {
                common.logger.logError('Get contenttype from library - ERROR - 148', error, serviceId + '.getContentTypesFromLibrary');
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // the lsit of documents from the library
        function getDocuments(clientId, projectId, loadFromHostWeb) {
            var deferred = $q.defer();

            setDocLibId(clientId)
                .then(function (data) {
                    var filter = "?$select=EncodedAbsUrl,FileRef,FileLeafRef,Modified,Author/ID,Author/Title&$expand=Author/ID,Author/Title"
                    var url = clientDocumentsUrl.replace("placeholder", data + "_Documents");
                    url = url + filter;

                    url = addRequestExecuterContext(loadFromHostWeb, url, spContext.hostWeb.url);

                    $http({
                        method: 'GET',
                        url: url
                    })
                    .then(function (response) {
                        common.logger.logDebug('Get Documents - OK - 197', response, serviceId + '.getDocuments.success');
                        deferred.resolve(response.data.d.results);
                    }, function (error) {
                        common.logger.logError('Get Documents - 200', error, serviceId + '.getDocuments.error');
                        deferred.reject(error);
                    });
                })
            return deferred.promise;

        }

        // not overly sure whtat this is for
        function addRequestExecuterContext(loadFromHostWeb, restUrl, hostweburl) {
            var modifiedUrl = restUrl;

            common.logger.logDebug('modifiedUrl - 210', modifiedUrl, serviceId + '.addRequestExecuterContext');

            if (loadFromHostWeb) {

                modifiedUrl = modifiedUrl.replace("_api/", "_api/SP.AppContextSite(@target)/");
                modifiedUrl = modifiedUrl + ((modifiedUrl.indexOf("?") > -1) ? "&" : "?") + "@target='" + hostweburl + "'";
            }

            return modifiedUrl;
        }

    }
})();