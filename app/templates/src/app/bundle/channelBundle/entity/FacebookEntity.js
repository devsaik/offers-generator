/**
 * Created by v. rogalin for ppm-portable.
 */

'use strict';
angular.module('ChannelBundle')
  .factory('FacebookEntity', [
    'ChannelEntity', 'moment', 'validator', 'appConfig', function (BaseEntity, moment, validator, appConfig) {
      function FacebookEntity() {
        BaseEntity.prototype.$construct.apply(this, arguments);
      }


      FacebookEntity.prototype = {
        $getDefaults: function(){
          return appConfig.channelBundle.channels.facebook.entity.defaults;
        }

      };

      BaseEntity.extend(FacebookEntity);

      return FacebookEntity;
    }
  ]);
