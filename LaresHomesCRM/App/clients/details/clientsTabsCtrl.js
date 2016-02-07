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


        $scope.showSpinner = false;

        var log = common.logger;
        var clientId = +$routeParams.id;
        var clientNameId;


        $scope.Tabs = [
            {
                name: "Contracts"
            },
            {
                name: "Selections"
            },
            {
                name: "Construction"
            },
            {
                name: "Emails"
            }
        ];
        log.Debug('$scope - 38', $scope, controllerId);

        var activeTab = $scope.Tabs[0].name;

        // init controller
        init();

        // init controller
        function init() {

            // get the ClientName ID for the doc libaries
            if (clientId) {
                $scope.showSpinner = true;

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
                getClientDocs(clientId, $scope.docLibName)
                .then(function (data) {

                    $scope.tabDocs = data;

                    log.Debug('$scope - 75', $scope, controllerId + '.getTabData');
                    $scope.showSpinner = false;

                }, function () {
                    log.Error('ERROR', error, controllerId);
                });
            }

        };

        // get the docs for the current Libary Tab
        function getClientDocs(clientId, docLibName) {
            return documentSrvc.getDocuments(clientId, docLibName);
        }

        // ============================================================================================================
        // dropZone config for uploading files

        $scope.fileBuffer = null;
        $scope.dropZoneCtrl = null;

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                'url': '_api/web/getfolderbyserverrelativeurl(\'\')/files',
                'autoProcessQueue': false,
                'clickable': true
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {

                },
                'success': function (file, response) {

                },
                "complete": function (file) {
                    this.removeFile(file);
                },

                "addedfile": function (file) {
                    // adjust Url for new file
                    var dropZone = this;
                    var listName = $scope.docLibName;

                    log.Debug('FILE - 116', file, controllerId + '.addedfile');

                    dropZone.options.url = "_api/web/getfolderbyserverrelativeurl('" + listName + "')/files/add(overwrite=true, url='" + file.name + "')";

                    /*-------------------------------------------------------------------------------------------*/
                    /* PROMISE CHAIN */
                    function getFileBuffer(selectedFile) {
                        log.Debug('selectedFile - 125', selectedFile, controllerId);

                        var deferred = $q.defer();
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(selectedFile);
                        log.Debug('reader - 130', reader, controllerId);

                        reader.onloadend = function (e) {
                            log.Debug('e - 133', e, controllerId);
                            deferred.resolve(e.target.result);
                        }

                        reader.onerror = function (e) {
                            deferred.reject(e.target.error);
                        }

                        return deferred.promise;
                    }

                    function FileToFolder(arrayBuffer) {
                        log.Debug('arrayBuffer - 142', arrayBuffer, controllerId + '.addfile.getFileBuffer');

                        return documentSrvc.addFileToFolder(arrayBuffer, dropZone);
                    }

                    function Complete(data) {
                        dropZone.removeFile(file);
                        log.Debug('file was uploaded - 149', dropZone, controllerId + '.addedfile.addFileToFolder');
                        getClientDocs(clientId, listName);

                        return $q.when(data);
                    }

                    function CatchError(error) {
                        log.logError('ERROR - 156', error, controllerId);
                    }

                    function CleanUp(response) {
                        log.logDebug('Completed - 157', response, controllerId);
                        log.logDebug('$scope - 157', $scope, controllerId);
                    }

                    getFileBuffer(file).then(FileToFolder).then(Complete).catch(CatchError).finally(CleanUp);
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