/**
 * Created by Artyom on 2/2/2015.
 */
'use strict';
angular.module('AppBundle')
  .factory('EventEmitter', function(){
    return window.EventEmitter;
  });
