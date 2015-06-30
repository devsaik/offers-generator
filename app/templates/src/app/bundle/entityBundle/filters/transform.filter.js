/**
 * Created by Nikita Yaroshevich
 */

'use strict';
angular.module('EntityBundle')
  .filter('transform', function (dataTransformer) {
    return function (obj, name) {
      return dataTransformer.$transform(name, obj);
    };
  });
