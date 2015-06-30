/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('display.channel', function (BaseChannel) {
    /**
     * @class
     * @extends BaseChannel
     * @constructor
     */
    function DisplayChannel() {
    }

    /**
     *
     * @type DisplayChannel
     */
    DisplayChannel.prototype = {
      getName: function(){
        return 'display';
      }
    };

    BaseChannel.extend(DisplayChannel);
    return new DisplayChannel();
  });
