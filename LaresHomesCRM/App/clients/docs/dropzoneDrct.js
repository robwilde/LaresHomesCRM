(function () {
    'use strict';

    var directiveId = 'dropzone';
    angular.module('app').directive(directiveId, ['common', function (common) {
        return function (scope, element, attrs) {
            var config, dropzone;
            var log = common.logger;

            config = scope[attrs.dropzone];
            //log.Debug('Directive Properties - 11', [scope, element, attrs], directiveId);

            // create a Dropzone for the element with the given options 
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers 
            angular.forEach(config.eventHandlers, function (handler, event) {
                log.Debug('eventHandlers - 11', [handler, event], directiveId);

                dropzone.on(event, handler);
            });

            // Update the total progress bar
            dropzone.on("totaluploadprogress", function (progress) {
                log.Debug('PROGRESS - 23', progress, directiveId);
                document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
            });

            dropzone.on("sending", function (file) {
                log.Debug('SENDING - 28', file, directiveId);

                // Show the total progress bar when upload starts
                document.querySelector("#total-progress").style.opacity = "1";
                // And disable the start button
                file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
            });

            // Hide the total progress bar when nothing's uploading anymore
            dropzone.on("queuecomplete", function (progress) {
                log.Debug('COMPLETE - 38', progress, directiveId);

                document.querySelector("#total-progress").style.opacity = "0";
            });

            scope[attrs.dropzonereference] = dropzone;
            //log.Debug('dropzone - 22', dropzone, directiveId);
        };
    }]);


})();