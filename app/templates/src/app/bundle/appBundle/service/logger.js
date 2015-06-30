/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('AppBundle')
  .service('logger', function () {
    return function(target){
      if (console && console.log){
        console.log(target);
      }
    };
  });
