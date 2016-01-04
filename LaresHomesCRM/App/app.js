﻿(function () {
  'use strict';

  // create app
  var app = angular.module('app', [
    // ootb angular modules
    'ngRoute',      // app route (url path) support
    'ngCookies',    // cookie read/write support
    'ngSanitize',   // fixes HTML issues in data binding
    'ngAnimate',    // animation capabilities

    // my custom modules
    'common'
  ]);

  // startup code
  app.run(['$route', function($route) {
  }]);
})();