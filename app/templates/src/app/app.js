/**
 * Created by rca733 on 6/19/15.
 */

/**
 * @ngdoc module
 * @name PPPortable
 * @description Entry point of the App
 */
'use strict';
angular.module('PPPortable', [
//		'ngTouch',
  'angular-loading-bar',
  'templates',
  'config',
  'ui.router',
  'AppBundle',
  'EntityBundle',
  'OfferBundle',
  'ChannelBundle',
  'ngAnimate'

])
  //CONFIG MAIN APP
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    'ngDialogProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, ngDialogProvider) {

      $stateProvider
        .state('ppp', {
          //app works only with authenticated users
          resolve: {
            token: function(userService, $q){
              var defer = $q.defer();
              if(!userService.isAuthenticated()){
                userService.login()
                  .then(function () {
                    defer.resolve(userService.getToken());
                  })
                  .catch(function (r) {
                    defer.reject(r);
                  });
              }else{
                defer.resolve(userService.getToken());
              }
              return defer.promise;
            },
            user: function(token){
              return token.getUser();
            }
          },
          abstract: true,
          templateUrl: 'app/layout/main.tpl.html',
          controller: 'AppController'
        })
        .state('ppp.auth', {
          url: '/auth',
          views: {
            content: {
              template: '<h2>Loading...</h2>',
              controller: function($state){
                $state.go('ppp.offer.list');
              }
            }
          }
        })
        .state('error_authfail', {
          template: '<h2>Ooops! Looks like your session was expired</h2>'

        })
        .state('ppp.home', {
          url: '/',
          views: {
            rightside: {
              templateUrl: 'app/layout/partial/popular-items.tpl.html'
            }
          }
        });

      $urlRouterProvider.otherwise('/offer/list');

      $locationProvider.html5Mode(false).hashPrefix('!');

      ngDialogProvider.setDefaults({
        closeByDocument: false,
        closeByEscape: true
      });
    }
  ])

  // RUN MAIN APP
  .run(function ($state, $rootScope, $log, appTools, userService) {
    //@todo: make a better solution then load it from CDN
    appTools.loadCSS('//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css');
    appTools.loadCSS('//fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic,900italic');
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      $log.error(error);
      $state.go(fromState);
    });
    $rootScope.$on('event:auth-singing-fail', function(){
      $state.go('error_authfail');
    });

    $rootScope.$on('event:auth-loginRequired', function () {
      if (userService.getAuthenticationAttemptsCount() < 2){
        userService.login()
          .then(function () {

          })
          .catch(function () {

          });
      } else {

        $state.go('error_authfail');
      }

    });
  })

  //MAIN APP CONTROLLER
  .controller('AppController', function AppController($scope, appTools) {
    $scope.__show_debug = appTools.getEnvName() === 'DEV';


  })
;

