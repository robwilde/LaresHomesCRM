(function () {

    'use strict';

    var controllerId = 'ClientFormCtrl';

    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$uibModalInstance', '$routeParams', '$q', 'common', 'client', clientFormCtrl]);

    function clientFormCtrl($scope, $location, $uibModalInstance, $routeParams, $q, common, client) {
        var log = common.logger;

        $scope.jobNumberPattern = '^[0-9]{1,4}$';
        $scope.client = new lhc.models.client();
        $scope.client = client || $scope.client;
        $scope.passLength = 5;

        var Client = $scope.client;

        $scope.save = function () {
            $uibModalInstance.close($scope.client);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$watch('client.ClientsLastName', function (newValue, oldValue) {
            // Take Firstintial
            // MakeFirst Initial Upercase
            var FirstInitial = (Client.ClientsFirstName) ? Client.ClientsFirstName.charAt(0).toUpperCase() : '';
            log.Debug('FirstIntial', FirstInitial, controllerId);

            // Make LastNameFirstintial
            // update ClientUserName
            Client.ClientUserName = newValue + FirstInitial;
            // log.Debug('WATCH - 28', [newValue, oldValue], controllerId);
        });
        
        //$scope.$watch('client.ClientJobNumber', function (newValue, oldValue) {
        //    log.Debug('jobNumber', [newValue, oldValue], controllerId);
        //});

        function randomPassword() {
            var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
            var pass = "";
            for (var x = 0; x < $scope.passLength; x++) {
                var i = Math.floor(Math.random() * chars.length);
                pass += chars.charAt(i);
            }
            return pass;
        }

        $scope.generate = function () {
            log.Debug('$scope - 37', $scope, controllerId);
            Client.ClientPassword = randomPassword();
        };

    }

})();
