/**
 * Created by Никита on 14.01.2015.
 */

'use strict';
angular.module('ChannelBundle')
  .service('channelStatisticTransformer', function ($q) {
    function ChannelStatisticTransformer() {}

    ChannelStatisticTransformer.prototype = {
      $transform: function transform(stats) {
        function extend(obj, name) {

          function sum(o) {
            return Object.keys(o)
              .reduce(function (sum, key) {
                return sum + parseFloat(o[key]);
              }, 0);
          }
          var tmp = angular.copy(obj[name]);
          delete obj[name];
          delete obj.accepts;
          delete obj.clicks;
          delete obj.impressions;
          delete obj.redemptions;
          delete obj.views;
          delete obj.title;
          obj[name] = {
            info: tmp,
            total: sum(tmp)
          };
          return obj;
        }
        var metrics = ['dailyRoi', 'dailyCvr', 'dailyECpc', 'dailyECpa', 'dailyECpm', 'dailyNetRevenue', 'dailySpend'];
        for (var i = 0; i < metrics.length; i++) {
          extend(stats, metrics[i], stats.dailyNetRevenue);
        }
        return $q.resolve(stats);
      }
    };

  return new ChannelStatisticTransformer();

  });
