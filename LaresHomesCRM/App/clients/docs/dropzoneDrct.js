(function () {
    'use strict';

    var directiveId = 'dropzone';
    angular.module('app').directive(directiveId, ['common', function (common) {
        return function (scope, element, attrs) {
            var config, dropzone;
            var log = common.logger;

            config = scope[attrs.dropzone];
            //log.Debug('scope - 11', scope, directiveId);

            // create a Dropzone for the element with the given options 
            dropzone = new Dropzone(element[0], config.options);

            // bind the given event handlers 
            angular.forEach(config.eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            scope[attrs.dropzonereference] = dropzone;
            //log.Debug('dropzone - 22', dropzone, directiveId);
        };
    }]);


})();