/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('ChannelBundle')
  .factory('SmsEntity', [
    'ChannelEntity', 'moment', 'validator', 'appConfig', function (BaseEntity, moment, validator, appConfig) {

      /**
       * @class
       * @extends ChannelEntity
       * @constructor
       */
      function SmsEntity() {
        BaseEntity.prototype.$construct.apply(this, arguments);
      }


      /**
       *
       * @type SmsEntity
       */
      SmsEntity.prototype = {
        $getDefaults: function(){
          return appConfig.channelBundle.channels.sms.entity.defaults;
        },
        getType: function() {
          return 'sms';
        }

      };

      BaseEntity.extend(SmsEntity);

      return SmsEntity;
    }
  ]);
