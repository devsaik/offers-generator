/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .factory('BaseChannel', function (appConfig, $injector, ChannelEntity) {
    /**
     * @class
     * @abstract
     * @description
     * Base abstract class for channel. All channels should implements same interface
     * @constructor
     */
    function BaseChannel() {
    }

    /**
     *
     * @type BaseChannel
     */
    BaseChannel.prototype = {
      STATUS: {
        INCOMPLETE: 'INCOMPLETE',
        APPROVED: 'APPROVE',
        PENDING: 'PENDING',
        RUNNING: 'RUNNING',
        REJECTED: 'REJECTED',
        PAUSED: 'PAUSE',
        EXPIRED: 'EXPIRE',
        ARCHIVE: 'ARCHIVE'
      },

      /**
       * @method
       * @abstract
       * @description
       * should be implemented in destination class. return unique system name of the channel
       * @return {string}
       */
      getName: function () {
        throw 'BaseChannel.getName should be implemented in child class';
      },

      /**
       * @method
       * @description
       * @param data
       * @return {ChannelEntity}
       */
      getEntity: function (data) {
        if (this.getConfig().entityName){
          var EntityClass = $injector.get(this.getConfig().entityName);
          return angular.isObject(EntityClass) ? EntityClass : new EntityClass(data);
        }
        return new ChannelEntity(data);
      },
      /**
       * @method
       * @description
       * Human readable canonical name. by default will be get it from config
       * @return {string}
       */
      getCanonicalName: function () {
        return this.getConfig().name;
      },

      /**
       * @method
       * @description
       * gets current channel configuration. by default will get it from
       * appConfig.channelBundle.channels.example or can be overrided
       * @return {*}
       */
      getConfig: function () {
        function extendDeep(dst) {
          angular.forEach(arguments, function(obj) {
            if (obj !== dst) {
              angular.forEach(obj, function(value, key) {
                if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                  extendDeep(dst[key], value);
                } else {
                  dst[key] = value;
                }
              });
            }
          });
          return dst;
        }
        return extendDeep(angular.copy(appConfig.channelBundle.channels[this.getName()]), appConfig.channelBundle.channels.common);
      }
    };

    BaseChannel.extend = function (ChildClass) {
      var BaseClass = this;
      angular.extend(ChildClass, BaseClass);
      ChildClass.prototype = !ChildClass.prototype ? new BaseClass() : angular.copy(ChildClass.prototype, new BaseClass());
      return ChildClass;
    };

    return BaseChannel;
  });
