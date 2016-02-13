(function () {

    'use strict';

    var controllerId = 'ClientTabsCtrl';
    angular.module('app').controller(controllerId,
        ['$scope', '$routeParams', '$q', 'common', 'clientSrvc', 'documentSrvc', 'usSpinnerService', tabCtrl]);

    function tabCtrl($scope, $routeParams, $q, common, clientSrvc, documentSrvc, usSpinnerService) {
        // items for the pagination
        $scope.totalItems = undefined;
        $scope.itemsPerPage = 5;
        $scope.bigTotalItems = 100;
        $scope.bigCurrentPage = 1;
        
        //$scope.showSpinner = false;

        var log = common.logger;
        var clientId = +$routeParams.id;
        var clientNameId;


        $scope.Tabs = [
            { name: "Contracts" },
            { name: "Selections" },
            { name: "Construction" },
            { name: "Emails" }
        ];

        log.Debug('$scope - 38', $scope, controllerId);
        var activeTab = $scope.Tabs[0].name;

        // init controller
        init();

        // init controller
        function init() {

            // get the ClientName ID for the doc libaries
            if (clientId) {
                //$scope.showSpinner = true;

                clientSrvc.getClientNameId(clientId)
                .then(function (data) {
                    clientNameId = data;

                    $scope.getTabData();
                });
            }

            log.Info("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        };

        // function to get the documents based on the tab selected
        $scope.getTabData = function (docType) {
            var docType = docType || activeTab;

            if (clientNameId) {
                $scope.docLibName = clientNameId + '_' + docType;
                getClientDocs()
                .then(function (data) {

                    $scope.tabDocs = data;

                    //log.Debug('$scope - 75', $scope, controllerId + '.getTabData');
                    //$scope.showSpinner = false;

                }, function (error) {
                    log.Error('ERROR', error, controllerId);
                });
            }

        };

        // get the docs for the current Libary Tab
        function getClientDocs() {
            return documentSrvc.getDocuments(clientId, $scope.docLibName);
        }

        // ============================================================================================================
        // dropZone config for uploading files

        $scope.fileBuffer = null;
        $scope.dropZoneCtrl = null;

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                url: '_api/web/getfolderbyserverrelativeurl(\'\')/files',
                maxFilesize: 100,
                maxThumbnailFilesize: 10,
                autoProcessQueue: false
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    log.Debug('SENDING - 42', [file, xhr, formData], serviceId);
                },
                'success': function (file, response) {
                    log.Debug('SUCCESS - 45', [file, response], serviceId);
                },
                "complete": function (file) {
                    log.Debug('COMPLETE - 45', file, serviceId);
                    this.removeFile(file);
                },

                "addedfile": function (file) {
                    // adjust Url for new file

                    var dropZone = this;
                    log.Debug('$scope - 117', $scope, controllerId);
                    log.Debug('dropZone - 118', dropZone, controllerId);
                    log.Debug('FILE - 119', file, controllerId);
                    /*=========================================================================================================================================*/
                    getFileBuffer()
                        .then(dropZoneOptions)
                        .then(addFile)
                        .then(getClientDocs)
                        .then(SetTabsScope)
                        .catch(handleError)
                        .finally(finalItems);

                    /*=========================================================================================================================================*/

                    /* GET THE FILE AND CREATE ARRAY BUFFER */
                    function getFileBuffer() {
                        var deferred = $q.defer();
                        var reader = new FileReader();

                        reader.onloadend = function (e) {
                            //log.Info('State - 137', e, controllerId);
                            deferred.resolve(e.target.result);
                        }
                        reader.onerror = function (e) {
                            deferred.reject(e.target.error);
                        }
                        reader.readAsArrayBuffer(file);

                        //log.Info('State - 145', reader.readyState, controllerId);
                        return deferred.promise;
                    }

                    /*SET THE DROPZONE OPTIONS*/
                    function dropZoneOptions(arrayBuffer) {
                        $scope.arrayBuffer = arrayBuffer;
                        var listName = $scope.docLibName;
                        dropZone.options.url = "_api/web/getfolderbyserverrelativeurl('" + listName + "')/files/add(overwrite=true, url='" + file.name + "')";
                        //log.Debug('data - 154', $scope, controllerId);

                        return $q.all(dropZone.options.url);
                    }

                    /*ADD FILE TO DOC FOLDER*/
                    function addFile(url) {
                        //log.Debug('data - 161', url, controllerId);
                        return documentSrvc.addFileToFolder($scope.arrayBuffer, dropZone.options.url);
                    }

                    function SetTabsScope(data) {
                        //log.Debug('data - 167', data, controllerId);
                        $scope.tabDocs = data;
                    }

                    /*ERROR HANDLER*/
                    function handleError(error) {
                        //log.Error('ERROR - 173', error, controllerId);
                    };

                    /*FINALITEMS TO RUN*/
                    function finalItems(data) {
                        dropZone.removeFile(file);
                        log.Debug('FINALLY - 179', data, controllerId);
                    }
                    /*-------------------------------------------------------------------------------------------*/

                    //getFile.done(function (arrayBuffer) {
                    //    log.Debug('arrayBuffer - 126', arrayBuffer, controllerId + '.addfile.getFileBuffer');
                    //    documentSrvc.addFileToFolder(arrayBuffer, dropZone)
                    //        .then(function (data) {
                    //            dropZone.removeFile(file);
                    //            log.Debug('file was uploaded - 133', dropZone, controllerId + '.addedfile.addFileToFolder');
                    //            getClientDocs(clientId, listName);
                    //        }, function (error) {
                    //            log.Error('Error - 136', error, controllerId);
                    //        });
                    //    //$scope.fileBuffer = arrayBuffer;
                    //    //dropZone.processQueue();
                    //});

                }

            }
        };


    };

})();