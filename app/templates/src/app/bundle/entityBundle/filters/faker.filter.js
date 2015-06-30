/**
 * Created by Nikita Yaroshevich
 */

'use strict';
angular.module('EntityBundle')
  .filter('faker', function (faker) {
    return function (obj, namespace, method) {
      if (!faker[namespace] || !faker[namespace][method]){
        return obj.toString();
      }
      return faker[namespace][method].apply(faker, angular.isArray(obj) ? obj : [obj]);
    };
  });
