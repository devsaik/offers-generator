/**
 * Created by nikita on 3/13/14.
 */
'use strict';
angular.module('AppBundle')
  .service('ppBridgeEntityManager',
  function ($q, $injector, BaseEntityManager, appTools, $timeout) {
    /**
     * @class
     * @description
     * Lorem
     * @constructor
     */
    function PPBridgeManager() {
    }

    var bridge = appTools.getPPPortableBridge();
    /**
     *
     * @type PPBridgeManager
     */
    PPBridgeManager.prototype = {
      $getDefaultEntityName: function () {
        return 'PPBridgeEntity';
      },
      $isBridgeEnabled: function(name){
        return bridge[name] !== undefined;
      },
      $$callRemote: function (options) {
        var deferred = $q.defer();
        if (!options.url) {
          throw 'You should provide bridge name';
        }

        if (bridge[options.url]){
          bridge[options.url](function(items){
            $timeout(function(){
              deferred.resolve(items);
            });
          },function(reason){
            $timeout(function(){
              deferred.reject(reason);
            });
          });
        } else {
          deferred.reject('There are now bridge available');
        }
        return deferred.promise;
      }

    };
    BaseEntityManager.extend(PPBridgeManager);
    return new PPBridgeManager();
  }
)
;
