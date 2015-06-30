'use strict';
angular.module('AppBundle')
  .factory('PPBridgeRepository',
  ['BaseEntityRepository' , 'PPBridgeEntity',
    function (Repository, PPBridgeEntity) {
      function PPBridgeRepository() {
        this.$$entityType = PPBridgeEntity;
      }


      PPBridgeRepository.prototype = {
        $$getEntityUrl: function(){
          return this.$$entityName;
        },
        $isEnabled: function(){
          return this.$getEM().$isBridgeEnabled(this.$$entityName);
        }
      };
      Repository.extend(PPBridgeRepository);
      return PPBridgeRepository;
    }]
);
