/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('sms.channel', function (BaseChannel) {
    /**
     * @class
     * @extends BaseChannel
     * @constructor
     */
    function SmsChannel() {
    }

    /**
     *
     * @type SmsChannel
     */
    SmsChannel.prototype = {
      getName: function(){
        return 'sms';
      },

      getTransformerName: function(){
        return 'freeChannel';
      }
    };

    BaseChannel.extend(SmsChannel);
    return new SmsChannel();
  });
