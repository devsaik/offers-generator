/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('share.channel', function (BaseChannel) {
    function ShareChannel() {
    }

    ShareChannel.prototype = {
      getName: function () {
        return 'share';
      }
    };

    BaseChannel.extend(ShareChannel);
    return new ShareChannel();
  });
