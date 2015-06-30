/**
 * @ngdoc service
 * @name AdEntity
 * @description
 * The AdEntity service
 * */
'use strict';
angular.module('ChannelBundle')
  .factory('AdEntity',
  /**
   * @param {ImageEntity} ImageEntity
   * @return {AdEntity}
   */
  function (ImageEntity) {
    /**
     * @ngdoc type
     * @name AdEntity
     * @description
     * This is Ad entity
     * @extends ImageEntity
     * @constructor
     *
     */
    function AdEntity() {
      ImageEntity.prototype.$construct.apply(this, arguments);
    }

    AdEntity.prototype = {
      /**
       *
       * @param {ImageEntity} image
       */
      fromImageEntity: function (image) {
        this.name = image.title;
        this.url = image.url;
        this.bannerImageId = image.id;
      }
    };

    ImageEntity.extend(AdEntity);

    return AdEntity;
  }
);
