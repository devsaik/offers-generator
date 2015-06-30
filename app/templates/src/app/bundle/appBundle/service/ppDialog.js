/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */
'use strict';
angular.module('AppBundle')
  .service('ppDialog', function (ngDialog) {
    /**
     * @class
     * @description
     * Manage dialogs in the app
     * @constructor
     */
    function PPDialog() {

    }

    /**
     *
     * @type PPDialog
     * */
    PPDialog.prototype = {
      ICONS: {
        HAND: '/assets/img/offers/hand.png',
        HANDS: '/assets/img/offers/hands.png',
        FOLDER: '/assets/img/offers/folder.png',
        PLAY: '/assets/img/offers/play.png',
        TRASH: '/assets/img/offers/trash.jpg'
      },

      confirmOffer: function (icon, title) {
        return ngDialog.openConfirm({
          template: 'app/bundle/appBundle/template/dialogs/offer-notifications.tpl.html',
          className: 'ngdialog-theme-default pp-portable-app pp-popup small',
          controller: ['$scope',function($scope){
            $scope.title = title;
            $scope.icon = icon;
          }]
        });
      },
      confirm: function (text) {
        return ngDialog.openConfirm({
          template: '<p>' + (text || 'Are you sure?') + '</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button></div>',
          plain: true
        });
      },
      confirmReversed: function (text) {
        return ngDialog.openConfirm({
          template: '<p>' + (text || 'Are you sure?') + '</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="confirm(1)">No</button><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(0)">Yes</button></div>',
          plain: true
        });
      },
      confirmClose: function () {
        return ngDialog.openConfirm({
          template: 'app/bundle/appBundle/template/dialogs/notification-close.tpl.html',
          className: 'ngdialog-theme-default pp-portable-app pp-popup small',
          controller: ['$scope', function ($scope) {
            $scope.title = 'All unsaved data will be lost. Continue?';
            $scope.icon = 'assets/img/offers/warning.png';
          }]
        });
      },
      open: function (options) {
        options = options || {};
        options.data = options.data || {};
        options.theme = options.theme || 'ngdialog-theme-default pp-portable-app';
        options.classApp = options.classApp || 'pp-popup';
        options.className = options.className ? options.theme + ' ' + options.classApp + ' ' + options.className : options.theme + ' ' + options.classApp;
//        options = angular.extend(options, {
//          className: 'ngdialog-theme-default'
//        });
        return ngDialog.open(options);
      },
      close: function (id, value) {
        return ngDialog.close(id, value);
      },
      openOfferTutorial: function () {
        this.open({
          className: 'popup-tutorial-offer middle',
          template: 'app/bundle/offerBundle/template/dialog/tutorial-offer/index.tpl.html',
          controller: ['$scope', '$state', function ($scope, $state) {
            $scope.controls = {
              step: 0
            };
            $scope.next = function () {
              $scope.controls.step += 1;
            };
            $scope.back = function () {
              $scope.controls.step -= 1;
            };
            $scope.close = function () {
              $scope.closeThisDialog(0);
              $state.go('ppp.offer.list.item.edit', {id: 'new'});
            };
          }]
        });
      }
    };
    return new PPDialog();
  });
