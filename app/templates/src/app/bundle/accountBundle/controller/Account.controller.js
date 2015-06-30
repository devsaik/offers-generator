/**
 * Created by nilagor on 05.03.15.
 */

'use strict';


angular.module('AccountBundle')
  .controller('AccountController', function ($scope, account, users, plan, moment, AccountManager) {
    $scope.account = account;
    $scope.account.users = users;
    $scope.account.plan = plan;

    $scope.userStatuses = AccountManager.STATUSES;
    $scope.userTypes = AccountManager.TYPES;
    $scope.plansParams = AccountManager.PLANS;

    //functions to work with account info
    $scope.saveAccount = function saveAccount() {
      AccountManager.saveData($scope.account).then(function (res) {
        angular.extend($scope.account, res);
      });
    };
    $scope.verifyPassword = function verifyPassword(pass, callback) {
      AccountManager.verifyPassword(pass).then(function (res) {
        if (callback !== undefined && callback instanceof Function) {
          callback(res.verify);
        }
      });
    };
    $scope.updatePassword = function updatePassword(pass) {
      AccountManager.setPassword(pass).then(function (res) {
        angular.extend($scope.account, res);
      });
    };
    $scope.setSecretQues = function setSecretQues(ques, ans) {
      AccountManager.setSecretQuesAndAns(ques, ans).then(function (res) {
        angular.extend($scope.account, res);
      });
    };

    //functions to work with user list
    $scope.createUser = function addUser(user, callback) {
      AccountManager.createUser(user).then(function (res) {
        $scope.account.users.push(res);
        if (callback !== undefined && callback instanceof Function) {
          callback();
        }
      });
    };
    $scope.inviteUser = function inviteUser(user) {
      AccountManager.inviteUser(user).then(function (res){
        console.log(res);
        var updatedUser = _.find(account.users, {id: res.id});
        angular.extend(updatedUser, res);
      });
    };
    $scope.activateUser = function activateUser(user) {
      user.status = 'active';
      AccountManager.updateUser(user);
    };
    $scope.holdUser = function holdUser(user) {
      user.status = 'on hold';
      AccountManager.updateUser(user);
    };

    //function to work with account plan
    $scope.switchPlan = function switchPlan() {
      $scope.account.plan.title = $scope.account.plan.title === 'pro' ? 'go' : 'pro';
      AccountManager.setPlan($scope.account.plan).then(function (res) {
        $scope.account.plan = res;
      });
    };
  })
;
