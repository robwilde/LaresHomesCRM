(function () {

    'use strict';

    var controllerId = 'clientsDashCtrl';
    angular.module('app').controller(controllerId, ['$location', 'common', clientsDashboard]);

    function clientsDashboard($location, common) {
        var DashCtrl = this;

        DashCtrl.Clients = WPQ1ListData;

        // init controller
        init();

        // init controller
        function init() {
            common.logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }

        common.logger.logError('Checking DashCtrl', DashCtrl, controllerId);

    };

    var WPQ1ListData = [
        {
            "ID": "1",
            "ClientsFirstName": "James",
            "ClientsLastName": "Butt",
            "ClientsPhone": "08-845-142",
            "ClientsEmail": "<a href=\"mailto:jbutt@gmail.com\">jbutt@gmail.com<\u002fa>",
            "ClientsAddress": "6649 N Blue Gum St",
            "ClientsSuburb": "New Orleans",
            "ClientsCity": "Orleans",
            "ClientsPostcode": "48116",
            "ClientsProjectStatus": "In-Progress"
        },
        {
            "ID": "2",
            "ClientsFirstName": "Ernie",
            "ClientsLastName": "Stenseth",
            "ClientsPhone": "201-387-9093",
            "ClientsEmail": "<a href=\"mailto:ernie_stenseth@aol.com\">ernie_stenseth@aol.com<\u002fa>",
            "ClientsAddress": "45 E Liberty St",
            "ClientsSuburb": "Ridgefield Park",
            "ClientsCity": "Bergen",
            "ClientsPostcode": "07660",
            "ClientsProjectStatus": "On-Hold"
        },
        {
            "ID": "3",
            "ClientsFirstName": "Mattie",
            "ClientsLastName": "Poquette",
            "ClientsPhone": "602-277-4385",
            "ClientsEmail": "<a href=\"mailto:mattie@aol.com\">mattie@aol.com<\u002fa>",
            "ClientsAddress": "73 State Road 434 E",
            "ClientsSuburb": "Phoenix",
            "ClientsCity": "Maricopa",
            "ClientsPostcode": "85013",
            "ClientsProjectStatus": "Closed"
        }
    ];

})();