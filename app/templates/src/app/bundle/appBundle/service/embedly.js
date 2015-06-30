/**
 * @ngdoc service
 * @name embedly
 * @description
 * Embedly manager format
 * */
'use strict';
angular.module('AppBundle')
  .service('embedly',
  /**
   *
   * @param $q
   * @param {PPEntityManager} ppEntityManager
   * @return {Embedly}
   * @param {ImageEntity} ImageEntity
   */
  function ($q, ppEntityManager, ImageEntity) {

    /**
     * @class
     * @constructor
     */
    function Embedly() {

    }

    /**
     *
     * @type Embedly
     */
    Embedly.prototype = {
      extract: function (inputUrl) {
        var escapedUrl = encodeURI(inputUrl);
        var embedlyRequest = '/ad/oembed?&url=' + escapedUrl;
        return ppEntityManager.$get({
          url: embedlyRequest
        });
      },
      getImages: function(url){
        return this.extract(url)
          .then(function(data){
            var images = [];
            angular.forEach(data.images, function(item){
              images.push(new ImageEntity({
                  url: item.url,
                  title: data.title,
                  tags: ['imported']
                }
              ));
            });
            return images;
          });
      }
    };

    return new Embedly();
  });
