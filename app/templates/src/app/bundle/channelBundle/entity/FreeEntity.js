/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('ChannelBundle')
  .factory('FreeEntity', [
    'ChannelEntity', 'moment', 'validator', 'appConfig', function (BaseEntity, moment, validator, appConfig) {

      /**
       * @class
       * @extends ChannelEntity
       * @constructor
       */
      function FreeEntity() {
        BaseEntity.prototype.$construct.apply(this, arguments);
      }


      /**
       *
       * @type FreeEntity
       */
      FreeEntity.prototype = {
        $getDefaults: function(){
          return appConfig.channelBundle.channels.free.entity.defaults;
        },
        getType: function() {
          return 'free';
        }
      };

      BaseEntity.extend(FreeEntity);

      return FreeEntity;
    }
  ]);
