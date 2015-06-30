/**
 * Created by nikita on 3/13/14.
 */
'use strict';
angular.module('AppBundle')
  .service('ppProxyEntityManager',
  /**
   *
   * @param $http
   * @param $q
   * @param $injector
   * @param {FakeEntityManager} FakeEntityManager
   * @param appConfig
   * @param appTools
   * @param userService
   * @param EventEmitter
   * @param {CacheIt} cacheIt
   * @return {PPProxyEntityManager}
   */
  function ($http, $q, $injector, FakeEntityManager, appConfig, appTools) {
    var envOptions = appTools.getProxyHttpConfig();

    /**
     * @class
     * @extends FakeEntityManager
     * @constructor
     */
    function PPProxyEntityManager() {

      /**
       * @override settings
       */
      this.settings = envOptions;
    }


    PPProxyEntityManager.prototype = {
      $getDefaultEntityName: function () {
        return 'BaseEntity';
      }
    };
    FakeEntityManager.extend(PPProxyEntityManager);
    return new PPProxyEntityManager();
  }
)
;
