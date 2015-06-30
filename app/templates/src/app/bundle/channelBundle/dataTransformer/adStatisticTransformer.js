/**
 * Created by Никита on 14.01.2015.
 */

'use strict';
angular.module('ChannelBundle')
  .service('adStatisticTransformer', function ($q) {
    function AdStatisticTransformer() {}

    AdStatisticTransformer.prototype = {
      $transform: function transform(stats) {
        function extend(obj, name) {

          function sum(obj) {
            return Object.keys(obj)
              .reduce(function (sum, key) {
                return sum + parseFloat(obj[key]);
              }, 0);
          }
          var tmp = angular.copy(obj[name]);
          delete obj[name];
          delete obj.title;
          obj[name] = {
            info: tmp,
            total: sum(tmp)
          };
          return obj;
        }

        extend(stats,'dailyClicks');
        //extend(stats,'dailyCpm');
        extend(stats,'dailyCtr');
        extend(stats,'exchangeImressions');
        extend(stats,'dailyImpressions');
        extend(stats,'exchangeClicks');

        return $q.resolve(stats);
      }
    };

  return new AdStatisticTransformer();

  });
