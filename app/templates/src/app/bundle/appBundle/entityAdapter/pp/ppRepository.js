'use strict';
angular.module('AppBundle')
  .factory('PPRepository',
  /**
   * @ngdoc service
   * @name PPRepository
   * @param {BaseEntityRepository} BaseEntityRepository
   * @return {PPRepository}
   */
  function (BaseEntityRepository) {

    /**
     * @ngdoc type
     * @class
     * @description
     * This is Base pushpoint repository Repository. Currently it just an stub
     * @extends BaseEntityRepository
     *
     * @constructor
     *
     */
    function PPRepository() {
    }


    PPRepository.prototype = {
      on: function(eventName, listener){
        return this.$getEM().on(eventName, listener);
      },
      addListeners: function(eventName, listeners){
        return this.$getEM().addListeners(eventName, listeners);
      },
      trigger: function(eventName, args, chain){
        return this.$getEM().trigger(eventName, [].concat(args), chain);
      },
      off: function(eventName, listener){
        return this.$getEM().off(eventName, listener);
      },
      removeListeners: function(eventName, listeners){
        return this.$getEM().removeListeners(eventName, listeners);
      },
      once: function(eventName, listener){
        return this.$getEM().once(eventName, listener);
      }
    };
    BaseEntityRepository.extend(PPRepository);
    return PPRepository;
  }
);
