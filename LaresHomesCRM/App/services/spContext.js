(function () {
    'use strict';

    var serviceId = 'spContext';
    var loggerSource = '[' + serviceId + '] ';
    angular.module('app').service(serviceId, [
      '$log', '$cookieStore', '$window', '$location', '$resource', '$timeout', 'common', 'commonConfig', spContext]);

    function spContext($log, $cookieStore, $window, $location, $resource, $timeout, common, commonConfig) {
        var service = this; 
        var log = common.logger;

        var spWeb = {
            appWebUrl: '',
            url: '',
            title: '',
            logoUrl: ''
        };
        service.hostWeb = spWeb;

        // init the service
        init();

        // init... akin to class constructor
        function init() {
            log.Info(loggerSource, 'service loaded', null);

            // if values don't exist on querystring...
            if (decodeURIComponent($.getQueryStringValue("SPHostUrl")) === "undefined") {
                // load the app context form the cookie
                loadSpAppContext();

                // fire off automatic refresh of security digest
                refreshSecurityValidation();
            } else {
                // otherwise, creae the app context
                createSpAppContext();
            }
        }

        // create sharepoint app context by moving params on querystring to an app cookie
        function createSpAppContext() {
            log.Info(loggerSource, 'writing spContext cookie', null);

            var appWebUrl = decodeURIComponent($.getQueryStringValue("SPAppWebUrl"));
            $cookieStore.put('SPAppWebUrl', appWebUrl);

            var url = decodeURIComponent($.getQueryStringValue("SPHostUrl"));
            $cookieStore.put('SPHostUrl', url);

            var title = decodeURIComponent($.getQueryStringValue("SPHostTitle"));
            $cookieStore.put('SPHostTitle', title);

            var logoUrl = decodeURIComponent($.getQueryStringValue("SPHostLogoUrl"));
            $cookieStore.put('SPHostLogoUrl', logoUrl);

            log.Info(loggerSource, 'redirecting to app', null);
            $window.location.href = appWebUrl + '/app.html';
        }

        // init the sharepoint app context by loding the app's cookie contents
        function loadSpAppContext() {
            service.hostWeb.appWebUrl = $cookieStore.get('SPAppWebUrl');
            service.hostWeb.url = $cookieStore.get('SPHostUrl');
            service.hostWeb.title = $cookieStore.get('SPHostTitle');
            service.hostWeb.logoUrl = $cookieStore.get('SPHostLogoUrl');
            log.Info(loggerSource, 'loading spContext cookie', null);

        }

        // fire off automatic refresh of security digest
        function refreshSecurityValidation() {
            log.Info("refreshing security validation", service.securityValidation, serviceId);

            var siteContextInfoResource = $resource('_api/contextinfo?$select=FormDigestValue', {}, {
                post: {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose;',
                        'Content-Type': 'application/json;odata=verbose;'
                    }
                }
            });

            // request validation
            siteContextInfoResource.post({}, function (data) {
                // obtain security digest timeout & value & store in service
                var validationRefreshTimeout = data.d.GetContextWebInformation.FormDigestTimeoutSeconds - 10;
                service.securityValidation = data.d.GetContextWebInformation.FormDigestValue;
                log.Info("refreshed security validation", service.securityValidation, serviceId);
                log.Info("next refresh of security validation: " + validationRefreshTimeout + " seconds", null, serviceId);

                // repeat this in FormDigestTimeoutSeconds-10
                $timeout(function () {
                    refreshSecurityValidation();
                }, validationRefreshTimeout * 1000);
            }, function (error) {
                log.Error("response from contextinfo", error, serviceId);
            });


        }
    }
})();