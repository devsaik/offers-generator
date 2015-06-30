/**
 * Created by nilagor on 05.03.15.
 */

'use strict';

angular.module('AccountBundle', [

])
  .config(function ($stateProvider) {
    $stateProvider
      .state('ppp.account', {
        url: '/account',
        resolve: {
          account: function (token, AccountManager) {
            return AccountManager.getAccount();
          },
          users: function (token, AccountManager) {
            return AccountManager.getUsers();
          },
          plan: function (token, AccountManager) {
            return AccountManager.getPlan();
          }
        },
        views: {
          content: {
            controller: 'AccountController as accountController',
            templateUrl: 'app/bundle/accountBundle/template/layout.tpl.html'
          }
        }
      });
  });
