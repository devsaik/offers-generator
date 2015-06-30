/**
 * Created by nikita on 3/13/14.
 */
'use strict';
angular.module('AppBundle')
  .service('ppEntityManager',
  /**
   *
   * @param $http
   * @param $q
   * @param $injector
   * @param BaseEntityManager
   * @param appConfig
   * @param appTools
   * @param userService
   * @param EventEmitter
   * @param {CacheIt} cacheIt
   * @return {PPEntityManager}
   */
  function ($http, $q, $injector, BaseEntityManager, appConfig, appTools, userService, EventEmitter, cacheIt) {
    var envOptions = appTools.getPPHttpConfig();

    function PPError(e, httpError) {
      this.httpError = httpError;
      angular.extend(this, e);
      var errors = this.errors || [];
      var self = this;
      this.errors = [];
      if (errors || this.error) {
        angular.forEach(this.error || errors, function (d) {
          self.errors.push(new PPError(d));
        });
      }

      this.toString = function () {
        var error = this || this.httpError;
        if (error.errorCode === 'VALIDATION_FAILED') {
          return error.message || 'Validation Failed';
        }
        return (error.data && error.data.message) || error.message || 'Internal Error';
      };
      this.hasErrorCode = function(code){
        if (code === this.errorCode){
          return true;
        }
        for (var i = 0; i < this.errors.length; i++){
          if (this.errors[i].hasErrorCode && this.errors[i].hasErrorCode(code)){
            return true;
          }
        }
        return false;
      };
    }

    /**
     * @class
     * @extends BaseEntityManager
     * @extends EventEmitter
     * @constructor
     */
    function PPEntityManager() {
      var self = this;
      /**
       * @override settings
       */
      this.settings = envOptions;
      this.ERROR_CODES = {
        'VALIDATION_FAILED': 'VALIDATION_FAILED'
      };
      angular.extend(this, EventEmitter.prototype);

      //authService.loginConfirmed('success', function(config){
      //  //config.headers["Authorization"] = token;
      //  return config;
      //});
      userService.registerOnReAuthHeaderEditor(function(cfg){
        if (cfg.url.indexOf(self.$getEndpoint()) !== -1){
          cfg.headers.Authorization = 'Bearer ' + userService.getToken().getKey();
        }
        return cfg;
      });
    }


    PPEntityManager.prototype = {
      $getDefaultEntityName: function () {
        return 'BaseEntity';
      },
      $$callRemote: function (options) {
        options = angular.extend(this.$getHttpOptions(), options);
        var key = userService.getToken().getKey();
        options.headers = options.headers || {};
        options.headers.Authorization = 'Bearer ' + key;

        if (options.cacheIt && angular.isObject(options.cacheIt)) {
          var tagName = options.cacheIt.tag;
           key = angular.isFunction(options.cacheIt.key) ? options.cacheIt.key() : options.cacheIt.key;
          if (options.cacheIt.invalidate) {
            cacheIt.$invalidate(tagName, key);
          } else if (tagName && key && cacheIt.$has(tagName, key)) {
            return cacheIt.$get(tagName, key);
          }
        }
        return BaseEntityManager.prototype.$$callRemote.call(this, options)
          .then(function (response) {
            if (options.cacheIt && angular.isObject(options.cacheIt)) {
              var tagName = options.cacheIt.tag;
              var key = angular.isFunction(options.cacheIt.key) ? options.cacheIt.key() : options.cacheIt.key;
              cacheIt.$set(tagName, key, $q.resolve(angular.isFunction(options.cacheDelegate) ? options.cacheDelegate(response) : response));
            }
            return $q.resolve(response);
          })
          .catch(function (response) {
            return $q.reject(new PPError(response.data, response));
          });
      }

    };
    BaseEntityManager.extend(PPEntityManager);
    return new PPEntityManager();
  }
)
;
