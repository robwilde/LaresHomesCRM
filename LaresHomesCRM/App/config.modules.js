(function () {
    'use strict';

    var app = angular.module('app');

    app.config(function (paginationTemplateProvider) {
        paginationTemplateProvider.setPath('app/templates/dirPaginationTpl.html');
    });


})();