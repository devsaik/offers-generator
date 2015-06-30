/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('AppBundle')
  .factory('PPBridgeEntity', [
    'BaseEntity', 'moment', function (BaseEntity) {
      function PPBridgeEntity() {
        this.$construct(arguments[0] || null);
      }


      PPBridgeEntity.prototype = {

      };
      BaseEntity.repository = 'PPBridgeRepository';

      BaseEntity.extend(PPBridgeEntity);

      return PPBridgeEntity;
    }
  ]);
