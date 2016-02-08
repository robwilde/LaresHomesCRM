(function () {
    'use strict';

    // define factory
    var serviceId = 'documentSrvc';
    angular.module('app').factory(serviceId,
        ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', 'datacontext', documentService]);


    function documentService($rootScope, $http, $resource, $q, config, common, spContext, datacontext) {

        var clients = {},
            log = common.logger;

        // init factory
        function init() {
            log.Info('service loaded', null, serviceId);
        }

        init();

        var documentUrl = "_api/web/lists";
        var clientDocumentsUrl = "_api/web/lists/getbytitle(\'placeholder\')/items";

        return {
            addDocLibrary: addDocLibrary,
            addFileToFolder: addFileToFolder,
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
            };


            $http(req).then(function (data) {
                log.Debug('data', data, serviceId + '.addDocLibrary');

                deferred.resolve(data);
            }, function (error) {
                log.Error('ERROR', error, serviceId + '.addDocLibrary');
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // add file to selected folder
        function addFileToFolder(arrayBuffer, Url) {

            // Send the request and return the response.
            // This call returns the SharePoint file.
            var deferred = $q.defer();
            var url = addRequestExecuterContext(true, Url, spContext.hostWeb.url);

            log.Debug('arrayBuffer - 81', arrayBuffer, serviceId + '.addfile.addFileToFolder');
            //log.Debug('byteLength - 82', byteLength, serviceId + '.addfile.addFileToFolder');

            jQuery.ajax({
                url: url,
                type: "POST",
                data: arrayBuffer,
                processData: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": getRequestDigest(),
                    "content-length": arrayBuffer.byteLength
                }
            })
            .done(function (data) {
                log.Debug('DATA - 96', data, serviceId + '.addfile.addFileToFolder');
                deferred.resolve(data);
            })
            .fail(function (error) {
                log.Error('ERROR - 99', error, serviceId);
                deferred.reject(error);
            });

            return deferred.promise;

            //var req = {
            //    method: 'POST',
            //    url: url,
            //    headers: {
            //        "accept": "application/json;odata=verbose",
            //        "X-RequestDigest": getRequestDigest(),
            //        "content-length": arrayBuffer.byteLength
            //    },
            //    data: arrayBuffer
            //}
            //$http(req).then(function (data) {
            //    log.Debug('Data - 188', data, serviceId);
            //    deferred.resolve(data);
            //}, function (error) {
            //    log.Error('error - 191', error, serviceId);
            //    deferred.reject(error);
            //});
            //return deferred.promise;
        }

        // get the content from the docuemnt library
        function bindContentTypeToLibrary(docLibraryName, contentTypeId, loadFromHostWeb) {
            var deferred = $q.defer();

            var url = "_api/web/lists/getbytitle(\'" + docLibraryName + "\')/ContentTypes/AddAvailableContentType";
            log.Debug('URL - 72', url, serviceId + '.bindContentTypeToLibrary');

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
            };

            $http(req).then(function (data) {
                log.Debug('Bind contentType to library - 97', data, serviceId + '.bindContentTypeToLibrary');
                deferred.resolve(data.d);
            }, function (error) {
                log.Error('Bind contentType to library - 94 - ERROR', error, serviceId + '.bindContentTypeToLibrary');
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
                    //log.Debug('Delete contenttype from library - 121', data, serviceId + '.deleteContentTypeFromLibrary');
                    deferred.resolve(data);
                },
                error: function (error) {
                    log.Error('Delete contenttype from library - 125 - ERROR', error, serviceId + '.deleteContentTypeFromLibrary');
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
                //log.Debug('Get contenttype from library - OK - 145', response, serviceId + '.getContentTypesFromLibrary');
                deferred.resolve(response.data.d.results);
            }, function (error) {
                log.Error('Get contenttype from library - ERROR - 148', error, serviceId + '.getContentTypesFromLibrary');
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // the lsit of documents from the library
        function getDocuments(clientId, docLibName) {
            var deferred = $q.defer();

            var filter = "?$select=EncodedAbsUrl,FileRef,FileLeafRef,Modified,Author/ID,Author/Title&$expand=Author/ID,Author/Title"
            var url = clientDocumentsUrl.replace("placeholder", docLibName);
            url = url + filter;

            url = addRequestExecuterContext(true, url, spContext.hostWeb.url);

            $http({
                method: 'GET',
                url: url
            })
            .then(function (response) {
                //log.Debug('response', response, serviceId + '.getDocuments');
                deferred.resolve(response.data.d.results);
            }, function (error) {
                log.Error('ERROR', error, serviceId + '.getDocuments');
                deferred.reject(error);
            });
            return deferred.promise;

        }

        // allow the execution of request cross domain
        function addRequestExecuterContext(loadFromHostWeb, restUrl, hostweburl) {
            var modifiedUrl = restUrl;

            //log.Debug('modifiedUrl - 210', modifiedUrl, serviceId + '.addRequestExecuterContext');

            if (loadFromHostWeb) {

                modifiedUrl = modifiedUrl.replace("_api/", "_api/SP.AppContextSite(@target)/");
                modifiedUrl = modifiedUrl + ((modifiedUrl.indexOf("?") > -1) ? "&" : "?") + "@target='" + hostweburl + "'";
            }

            return modifiedUrl;
        }

        // ==========================================================================================

    }
})();