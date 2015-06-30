/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('AppBundle')
  .service('social', function ($injector, appConfig, appTools, $q) {
    var providers = {};

    function Social() {

    }

    Social.prototype = {
      isEnabled: function (name) {
        return this.get(name) || false;
      },
      $add: function (name, provider) {
        providers[name] = provider;
        return this;
      },
      $remove: function (name) {
        delete providers[name];
        return this;
      },
      get: function (name) {
        var defer = $q.defer();
        if (providers[name]) {
          defer.resolve(providers[name]);
        } else {
          return this.$load(name);
        }
        return defer.promise;
      },
      $load: function (name) {
        var defer = $q.defer();
        var self = this;
        try {
          var SocialClassOrObject = $injector.get(name + '.social');
          if (angular.isFunction(SocialClassOrObject)) {
            var socialCfg = appConfig.SOCIAL[appTools.getEnvName()] || {};
            var appCfg = appTools.getPPPortableClientCfg();
            var cfg = angular.extend(appCfg.fb || {}, socialCfg.fb || {});
            var currentProvider = new SocialClassOrObject(cfg);
            if (angular.isFunction(currentProvider.load)) {
              currentProvider.load(cfg)
                .then(function (p) {
                  self.$add(name, p);
                  defer.resolve(p);
                })
                .catch(function () {
                  throw 'Unable to load social provider';
                });
            } else {
              defer.resolve(currentProvider);
            }
          } else {
            defer.resolve(SocialClassOrObject);
          }
//          return
        } catch (e) {
          defer.reject('Unsupported provider');
        }

        return defer.promise;
      }
    };


    return new Social();
  });
