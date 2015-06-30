/**
 * Created by V. Rogalin for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('facebook.channel', function (BaseChannel) {
    /**
     * @class
     * @extends BaseChannel
     * @constructor
     */
    function FacebookChannel() {
    }

    /**
     *
     * @type FacebookChannel
     */
    FacebookChannel.prototype = {
      getName: function(){
        return 'facebook';
      }
    };

    BaseChannel.extend(FacebookChannel);
    return new FacebookChannel();
  });
