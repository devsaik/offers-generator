/**
 * Created by nilagor on 06.03.15.
 */

'use strict';
angular.module('AccountBundle')
  .service('AccountManager',
  /**
   *
   * @param {PPProxyEntityManager} ppProxyEntityManager
   * @returns {AccountManager}
   */
  function (ppProxyEntityManager) {

    /**
     * @ngdoc type
     * @class
     * @extends PPRepository
     * @description
     * This is Ad PPRepository
     * @constructor
     *
     */
    function AccountManager() {
      this.$$entityName = 'account';
    }

    /**
     * @type ItemRepository
     */
    AccountManager.prototype = {

      STATUSES: [
        'active',
        'on hold'
      ],

      TYPES: [
        'Mobile User'
      ],

      PLANS: {
        pro: {
          monthlyFee: 9.95,
          swipeRate: 1.95,
          aeSwipeRate: 2.95,
          keyRate: 2.95
        },
        go: {
          monthlyFee: 0,
          swipeRate: 2.7,
          aeSwipeRate: 2.95,
          keyRate: 3.7
        }
      },

      getAccount: function getAccount() {
        return ppProxyEntityManager.$get({url: '/account'});
      },

      saveData: function saveData(account) {
        return ppProxyEntityManager.$post({
          url: '/account',
          data: account
        });
      },
      verifyPassword: function verifyPassword(password) {
        return ppProxyEntityManager.$post({
          url: '/account/verifypass',
          data: {
            password: password
          }
        });
      },
      setPassword: function setPassword(password) {
        return ppProxyEntityManager.$post({
          url: '/account/updatepass',
          data: {
            password: password
          }
        });
      },
      setSecretQuesAndAns: function setSecretQuesAndAns(ques, ans) {
        return ppProxyEntityManager.$post({
          url: '/account/updateques',
          data: {
            question: ques,
            answer: ans
          }
        });
      },

      getUsers: function getAccountUsers() {
        return ppProxyEntityManager.$get({url: '/account/users'});
      },
      createUser: function createUser(user) {
        return ppProxyEntityManager.$put({
          url: '/account/users',
          data: user
        });
      },
      inviteUser: function inviteUser(user) {
        return ppProxyEntityManager.$post({
          url: '/account/users/invite',
          data: user
        });
      },
      updateUser: function updateUser(user) {
        return ppProxyEntityManager.$post({
          url: '/account/users',
          data: user
        });
      },

      getPlan: function getAccountPlan() {
        return ppProxyEntityManager.$get({url: '/account/plan'});
      },
      setPlan: function setPlan(plan) {
        return ppProxyEntityManager.$post({
          url: '/account/plan',
          data: plan
        });
      }
    };


    return new AccountManager();
  }
);
