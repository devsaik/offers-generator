/**
 * Created by nilagor on 11.03.15.
 */
'use strict';
angular.module('AccountBundle')
  .directive('accountInfo', function () {
    return {
      restrict: 'E',
      require: '^ngModel',
      templateUrl: 'app/bundle/accountBundle/template/directive/account-info.tpl.html',
      scope: {
        account: '=ngModel',
        saveAccount: '&onSave',
        passRequest: '&onPassRequest',
        updatePassword: '&onUpdatePassword',
        updateSecretQues: '&onUpdateSecretQues'
      },
      link: function ($scope, element) {
        $scope.onEdit =  $scope.passReqSuccess = false;
        $scope.passReq = $scope.newPassword = $scope.newPasswordVerify = '';
        $scope.activeTab = 'personal';

        $scope.$watch('onEdit', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            element.toggleClass('on-edit');
          }
        });
        $scope.$watch('activeTab', function (newActiveTab) {
          element.find('.tabs a.active').removeClass('active');
          element.find('.tabs a.' + newActiveTab).addClass('active');

          element.find('.tab-content.active').removeClass('active');
          element.find('.tab-content.' + newActiveTab).addClass('active');
        });
        $scope.$watch('account.emailPrefs', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            $scope.saveAccount();
          }
        }, true);

        $scope.closePassReq = function closePassReq(success) {
          if (success) {
            element.find('#pass-request').hide();
            $scope.passReqSuccess = true;
          } else {
            alert('Nope');
          }
        };

        $scope.checkAndUpdatePassword = function updatePasswordInDirective() {
          if ($scope.newPassword !== $scope.newPasswordVerify) {
            alert('Nope. Not equal');
          } else {
            $scope.updatePassword({pass: $scope.newPassword});
          }
        };

      }
    };
  });
