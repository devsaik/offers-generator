'use strict';
angular.module('AppBundle').
  factory('userService',
  function ($http, $q, appConfig, $cookieStore, authService, appTools, $rootScope, $interval) {

    /**
     * @class
     * @description
     * User token is the interface for the user authentication information.
     * @param properties
     * @constructor
     */
    function UserToken(properties) {
      angular.extend(this, properties || {});
//      this.user = {};
//      this.key = '';

      /**
       * @method
       * @description
       * get current auth user
       * @return {User}
       */
      this.getUser = function () {
        this.user = this.user || {};
        this.user = this.user instanceof User ? this.user : new User(this.user);
        return this.user;
      };

      /**
       * try to return current user auth key
       * @return {string}
       */
      this.getKey = function () {
        return this.key || false;
      };

      /**
       * @method
       * @description
       * check if user has target role
       * @param role
       * @return {boolean}
       */
      this.hasRole = function (role) {
        return this.getUser().roles ? this.getUser().roles.indexOf(role) !== -1 : false;
      };

      this.getUser();
    }

    /**
     * @class
     * @description
     * Main user service which Authenticated user and do all user depended staff
     * @constructor
     */
    function UserService() {
      this.token = new UserToken();
      var authAttempt = 0;
      var authHeaderCallbacks = [];


      this.__construct = function () {
//        var token = $cookieStore.get('AppBundle.userService.token');
//        if (token) {
//          this.setToken(token);
//        }
      };

      /**
       *
       * @return {string}
       */
      this.getMerchantId = function () {
        return this.getUser().id;
      };

      /**
       *
       * @param role
       * @return {boolean}
       */
      this.hasRole = function (role) {
        return this.getToken().hasRole ? this.getToken().hasRole(role) : false;
      };

      /**
       *
       * @return {User}
       */
      this.getUser = function () {
        return this.getToken().getUser();
      };

      /**
       *
       * @return {UserToken}
       */
      this.getToken = function () {
//        var token = new UserToken();
//        token.user = {id: -1, name: 'nikita'};
//        return token;
        return this.token;
      };

      /**
       * @method
       * @description
       * sets user token
       * @param {UserToken} token
       */
      this.setToken = function (token) {
        if (token instanceof UserToken) {
          this.token = token;
        } else {
          this.token = new UserToken(token);
        }
//        $cookieStore.put('AppBundle.userService.token', token);
//          $http.defaults.headers.common['X-ACCESS-KEY'] = token.getKey();
      };

      /**
       * @method
       * @description
       * check if current session user is Authenticated
       * @return {boolean}
       */
      this.isAuthenticated = function () {
//          return true;
        return !_.isEmpty(this.getToken().key);
      };

      /**
       * @method
       * @description
       * logout user
       */
      this.logout = function () {
        this.setToken(null);
      };

      /**
       * @method
       * @description
       * @alias this.authenticate
       * @returns {*}
       */
      this.login = function () {
        return this.authenticate();
      };

      /**
       * @method
       * @description
       * Disabled
       * @param data
       */
      this.register = function () {
        throw 'Registration is not allowed';
      };

      /**
       *
       * @return {number}
       */
      this.getAuthenticationAttemptsCount = function () {
        return authAttempt;
      };

      /**
       * register a function to adjust headers in http buffer, when user re-login
       * @param {Function} callback  receive the config and should return the config
       */
      this.registerOnReAuthHeaderEditor = function(callback){
        authHeaderCallbacks.push(callback);
      };

      /**
       * @method
       * @description authenticate current user
       * @returns {promise}
       */
      this.authenticate = function () {
        authAttempt++;
//                        return self.user;
        var deferred = $q.defer();
        var self = this;
        if (appTools.getPPPortableClientCfg().authenticate) {
          appTools.getPPPortableClientCfg().authenticate(function (key, merchantId) {
            $rootScope.$apply(function () {
              authAttempt = 0;
              self.user_id = merchantId;
              var token = {};
              token.user = {
                id: merchantId
              };
              token.key = key;
              self.setToken(token);
              authService.loginConfirmed(self.getToken(), function (config) {
                for (var i = 0; i < authHeaderCallbacks.length; i++){
                  var cfg = authHeaderCallbacks[i](config);
                  if (cfg){
                    config = cfg;
                  }
                }
                return config;
              });
              deferred.resolve(token);
            });
          }, function () {
            $rootScope.$broadcast('event:auth-singing-fail');
            $rootScope.$apply(function () {
              deferred.reject({msg: 'Authentication fail'});
            });
          });
        } else {
          deferred.reject({msg: 'Authentication method is not provided'});
        }

//          $http.get(appConfig.get('AUTHURL') + '?email=' + username + '&password=' + pwd)
//            .then(function (response, code) {
//              var token = {};
//              token.user = response.data.account;
//              token.key = response.data.auth.key;
//              self.setToken(token);
//              //$rootScope.$broadcast('event:auth-singing-success');
//              deferred.resolve(token);
//            }, function (data, code) {
//              //$rootScope.$broadcast('event:auth-singing-fail');
//              deferred.reject({msg: 'Invalid username or password'});
//            });

        return deferred.promise;

      };

      /**
       * @method
       * @description
       * re login user
       * @return {promise}
       */
      this.refreshUser = function () {
        return this.authenticate();
//        var deferred = $q.defer();
//          var self = this;
//          $http.get(appConfig.get('USERSTATUSURL'))
//            .then(function (response) {
//              self.getToken().user = response.data;
//              deferred.resolve(self.getUser());
//            }, function (response) {
//              //$rootScope.$broadcast('event:auth-singing-fail');
//              deferred.reject(response);
//            });
//        return  deferred.promise;
      };

      this.__construct();
    }
    var userService = new UserService();

    /**
     * @class
     * @description
     * Base app user class contains basic methods and properties
     * @param properties
     * @constructor
     */
    function User(properties) {
      var profile = null;
      angular.extend(this, properties || {});

      function loadProfile(user) {
        var cfg = appTools.getPPHttpConfig();
        var options = cfg.httpOptions;
        var key = userService.getToken().getKey();
        options.headers = options.headers || {};
        options.headers.Authorization = 'Bearer ' + key;
        options.baseUrl = cfg.endpointURL;


        return $http.get(options.baseUrl + '/profile/' + user.id, options)
          .then(function (profile) {
            //@todo pings to PPM, should be removed
            $interval(function () {
              options.ignoreLoadingBar = true;
              $http.get(options.baseUrl + '/profile/' + user.id, options);
            }, 5 * 60 * 1000);
            return $http.get(options.baseUrl + '/profile/branding/' + user.id, options)
              .then(function (branding) {
                return {
                  profile: profile.data,
                  branding: branding.data
                };
              });
          });
      }

      /**
       * @ngdoc mehod
       * @method
       * @description try to load user profiles info and cache it
       * @return {promise}
       */
      this.getProfile = function () {
        var defer = $q.defer();
        if (profile) {
          defer.resolve(profile);
        } else {
          //http://int.pushpointmobile.com/admin/api/profile/dde3728e-e974-4366-bc6b-44c91a3e6e97
          //appConfig.API[appTools.getEnvName()].PP.endpointURL
          loadProfile(this)
            .then(function (p) {
              profile = p;
              defer.resolve(profile);
            })
            .catch(function (e) {
              defer.reject(e);
            });
        }
        return defer.promise;
      };

      /**
       * @ngdoc mehod
       * @method
       * @description try to refresh user profile
       * @return {promise}
       */
      this.refreshProfile = function () {
        profile = null;
        return this.getProfile();
      };
    }


    return userService;
  }
);
