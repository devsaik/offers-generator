/**
 * @ngdoc service
 * @name LineItemEntity
 * @description
 * This service return LineItemEntity type
 * */
'use strict';
angular.module('OfferBundle')
  .factory('LineItemEntity', [
    'PPBridgeEntity', 'moment', function (BaseEntity) {

      /**
       * @ngdoc type
       * @name LineItemEntity
       * @description
       * This is offer entity
       * @extends BaseEntity
       * @constructor
       *
       */
      function LineItemEntity(data) {
        this.$construct(data || null);
        this.id = this.item_id;
        this.externalId = this.item_id;
        this.name = this.title;
        this.imageUrl = this.image_url ? this.image_url : null;
        delete this.image_url;
        delete this.title;
      }


      LineItemEntity.prototype = {
//        $getId: function(){
//          return this.item_id;
//        }
      };

      BaseEntity.extend(LineItemEntity);

      return LineItemEntity;
    }
  ]);
