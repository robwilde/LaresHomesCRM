(function () {
    'use strict';

    // define factory
    angular.module('common').factory('logger',
      ['$log', 'config', logger]);

    // create factory
    function logger($log, config) {
        var service = {
            log: log,
            logDebug: logDebug,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        // #region public members
        function log(message, data, source, showNotification) {
            writeLog(message, data, source, showNotification, "info");
        }

        function logDebug(message, data, source, showNotification) {
            writeLog(message, data, source, showNotification, "debug");
        }

        function logError(message, data, source, showNotification) {
            writeLog(message, data, source, showNotification, "error");
        }

        function logSuccess(message, data, source, showNotification) {
            writeLog(message, data, source, showNotification, "success");
        }

        function logWarning(message, data, source, showNotification) {
            writeLog(message, data, source, showNotification, "warning");
        }
        // #endregion

        // #region private members
        // universal method for writing notifications
        function writeLog(message, data, source, showNotification, notificationType) {
            var iconUrl, notiTitle;
            showNotification = showNotification || true;

            // write to angular log, & specify error if it is an error
            var write = (notificationType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);

            if (showNotification) {

                switch (notificationType) {
                    case 'info':
                        if (!config.showDebugNotiSetting) {
                            return;
                        } else {
                            iconUrl = "images/info.png";
                            notiTitle = "Lares Homes CRM: INFO LOG";
                        }
                        break;
                    case 'debug':
                        if (!config.showDebugNotiSetting) {
                            return;
                        } else {
                            iconUrl = "images/debug.png";
                            notiTitle = "Lares Homes CRM: DEBUG LOG";
                        }
                        break;
                    case 'error':
                        iconUrl = "images/error.png";
                        notiTitle = "Lares Homes CRM: ERROR";
                        break;
                    case 'warning':
                        iconUrl = "images/warning.png";
                        notiTitle = "Lares Homes CRM: WARNING";
                        break;
                    case 'succes':
                        iconUrl = "images/success.png";
                        notiTitle = "Lares Homes CRM";
                        break;
                }

            }

            // create sharepoint notification
            var notificationData = new SPStatusNotificationData("", STSHtmlEncode(message), iconUrl, null);
            var notification = new SPNotification(SPNotifications.ContainerID.Status, STSHtmlEncode(notiTitle), false, null, null, notificationData);

            // show sharepoint notification tile
            notification.Show(false);
        }
    }
    // #endregion
})();