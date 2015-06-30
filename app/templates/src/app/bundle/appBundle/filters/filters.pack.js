'use strict';
angular.module('AppBundle')
  .filter('get_service_var',
  /**
   * @description
   * return var from service obj
   */
  function ($injector) {
    return function (input, args) {
      var service = null;
      try {
        service = $injector.get(input);
      } catch (e){
        return 'Unknown service';
      }
      if (!args){
        return service;
      }
      return service[args];
    };
  })
  .filter('string_to_date',
  /**
   * @description
   * try to convert string to date
   */
  function (moment) {
    return function (input, format) {
      return moment(input, format);
    };
  })
  .filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });
