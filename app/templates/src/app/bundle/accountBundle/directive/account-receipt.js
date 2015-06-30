/**
 * Created by nilagor on 13.03.15.
 */
'use strict';
angular.module('AccountBundle')
  .directive('accountReceipt', function (moment) {
    return {
      restrict: 'E',
      require: '^ngModel',
      templateUrl: 'app/bundle/accountBundle/template/directive/account-receipt.tpl.html',
      scope: {
        account: '=ngModel',
        saveSettings: '&onSave'
      },
      link: function ($scope, element) {
        $scope.onEdit = false;
          $scope.fakeReceipt = {
          items: [
            {
              name: 'Example Item Name',
              price: 19.99
            }
          ],
          date: moment().format('MMM DD, YYYY'),
          time: moment().format('hh:mmA'),
          authCode: '123xzy',
          totalPrice: 19.99,
          cartType: 'vs',
          cartNumber: 8923
        };

        $scope.$watch('onEdit', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            element.toggleClass('on-edit');
          }
        });

        $scope.urlEscape = function (string) {
          return escape(string);
        };
      }
    };
  });
