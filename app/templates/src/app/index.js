'use strict';

angular.module('offers', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(['$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {
      $stateProvider
        .state('nav', {
          url: '/nav',
          templateUrl: 'app/components/navbar.tpl.html',
          controller: 'NavbarCtrl'
        });
      $locationProvider.html5Mode(false).hashPrefix('!');

      //$urlRouterProvider.otherwise('/');
    }]);
