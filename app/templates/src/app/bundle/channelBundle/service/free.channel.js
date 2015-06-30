/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('free.channel', function (BaseChannel) {
    /**
     * @class
     * @extends BaseChannel
     * @constructor
     */
    function FreeChannel() {
    }

    /**
     *
     * @type FreeChannel
     */
    FreeChannel.prototype = {
      getName: function(){
        return 'free';
      },
      getTransformerName: function(){
        return 'freeChannel';
      }
    };

    BaseChannel.extend(FreeChannel);
    return new FreeChannel();
  });
