/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */
'use strict';
angular.module('AppBundle')
  .service('$ppHttp', function ($http, userService, appTools) {
    function createShortMethodsWithData() {
      angular.forEach(arguments, function (name) {
        pHttp[name] = function (url, data, config) {
          return $http(angular.extend(config || {}, {
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }

    function createShortMethods() {
      angular.forEach(arguments, function (name) {
        pHttp[name] = function (url, config) {
          return $http(angular.extend(config || {}, {
            method: name,
            url: url
          }));
        };
      });
    }

    var pHttp = function (options) {
      var key = userService.getToken().getKey();
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + key;
      options.headers.Version = 2;
      options.url = appTools.getPPApiBaseUrl() + options.url;
      return $http(options);
    };
    createShortMethods('get', 'delete', 'head', 'jsonp');
    createShortMethodsWithData('post', 'put', 'patch');
    return pHttp;
  })
;
