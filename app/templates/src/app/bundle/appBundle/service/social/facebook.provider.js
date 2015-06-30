/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('AppBundle')
  .service('facebook.social', function ($q, appConfig, appTools, $timeout, $window, $rootScope) {
    // https://developers.facebook.com/docs/facebook-login/getting-started-web/

    function FacebookProvider() {
      this.FB = $window.FB;
      this.user = undefined;
    }

    FacebookProvider.prototype = {
      load: function (cfg) {
        var defer = $q.defer();
        var self = this;
        if (this.FB) {
          defer.resolve(self);
        } else {
          if (!cfg.appID) {
            defer.reject('Application didn\'t support Facebook');
          } else {
            appTools.loadScript('//connect.facebook.net/en_US/all.js#xfbml=1&appId=' + cfg.appID, function () {
              $window.FB.init(cfg);
              $timeout(function () {
                self.FB = $window.FB;
                defer.resolve(self);
              });
            });
          }

        }
        return defer.promise;
      },


      getUser: function () {
        var deferred = $q.defer();
        var FB = this.FB;
        var self = this;

        if (this.user){
          return $q.resolve(this.user);
        }

        FB.getLoginStatus(function (response) {
          if (response.status === 'connected') {
            FB.api('/me', function (response) {
              $rootScope.$apply(function () {
                self.user = response;
                deferred.resolve(response);
              });
            });
          } else if (response.status === 'not_authorized' || response.status === 'unknown') {
            FB.login(function (response) {
              if (response.authResponse) {
                FB.api('/me', function (response) {
                  $rootScope.$apply(function () {
                    self.user = response;
                    deferred.resolve(response);
                  });
                });
              } else {
                $rootScope.$apply(function () {
                  deferred.reject(response);
                });
              }
            }, {
              scope: 'email'
            });
          }
        });
        return deferred.promise;
      },

      share: function (data) {
        var FB = this.FB;
        if (!FB) {
          $q.reject('No Facebook API');
        }

        function shareIt(data){
          var defer = $q.defer();
          var shareData = angular.extend(data, {
            method: 'feed'
          });
          FB.ui(shareData,
            function (response) {
              $rootScope.$apply(function () {
                if (response && response.post_id) {
                  defer.resolve(response);
                } else {
                  defer.reject(response);
                }
              });
            });
          return defer.promise;
        }

        if (this.user){
          return shareIt(data);
        }

        return this.getUser()
          .then(function () {
            return shareIt(data);
          }).catch(function (reason) {
            return $q.reject(reason);
          });
      }
    };

    return FacebookProvider;
  });
