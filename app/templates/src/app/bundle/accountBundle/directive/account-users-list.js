/**
 * Created by nilagor on 12.03.15.
 */
'use strict';

angular.module('AccountBundle')
  .directive('accountUsersList', function () {
    return {
      restrict: 'E',
      require: '^ngModel',
      templateUrl: 'app/bundle/accountBundle/template/directive/account-users-list.tpl.html',
      scope: {
        users: '=ngModel',
        userStatuses: '=',
        userTypes: '=',
        holdUser: '&onHold',
        createUser: '&onCreate',
        inviteUser: '&onInvite',
        activateUser: '&onActivate'
      },
      link: function ($scope, element) {
        var block = element.find('.account-block');
        $scope.userFilter = 'active';
        $scope.showCreateForm = false;
        $scope.newUser = {
          firstName: '',
          lastName: '',
          email: '',
          type: 'Mobile only',
          state: 'Invite Not Sent',
          status: 'on hold'
        };
        $scope.verifyEmail = '';
        $scope.roles = ['Mobile only'];

        $scope.showActions = function showActions(userId) {
          block.find('tr.actions[data-user-id='+userId+']').toggle();
        };

        $scope.setUserFilter = function setUserFilter(status) {
          $scope.userFilter = status;
        };

        $scope.validateCreateForm = function validateCreateForm() {
          // it's bullshit. Will fit for prototype
          var noFirstName = $scope.newUser.firstName === '';
          var noLastName = $scope.newUser.lastName === '';
          var noEmail = $scope.newUser.email === '';
          var notVerifyEmail = $scope.newUser.email !== $scope.verifyEmail;

          if (noFirstName || noLastName || noEmail || notVerifyEmail) {
            alert('nope. validation error');
            return false;
          } else {
            return true;
          }
        };
        $scope.hideForm = function hideCreateUserForm() {
          $scope.showCreateForm = false;
        };
      }
    };
  });
