/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('AppBundle')
  .filter('pp.message', function ($interpolate) {
    var template = $interpolate('<li>{{text}}</li>');
    return function (text) {
      if (!text){
        return text;
      }
      if (text.errors && text.errors.length > 0) {
        var msgs = '';
        for (var i = 0; i < text.errors.length; i++) {
          var t = text.errors[i].toString ? text.errors[i].toString() : text.errors[i];
          msgs = msgs + template({text: t});
        }
        return '<ul class="pp-messages">' + msgs + '</ul>';
      } else if (text.statusText) {
        return '<p class="pp-message">' + text.statusText + '</p>';
      } else {
        return '<p class="pp-message">' + text + '</p>';
      }
    };
  });
