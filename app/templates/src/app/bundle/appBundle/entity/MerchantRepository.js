/**
 * Created by Nikita Yaroshevich for p3-app.
 */


'use strict';
angular.module('AppBundle')
  .factory('MerchantRepository',
  /**
   *
   * @param {PPRepository} PPRepository
   * @param appTools
   * @param {UserService} userService
   * @param $q
   * @return {MerchantRepository}
   */
  function (PPRepository, appTools, userService) {
    /**
     * @class
     * @extends PPRepository
     * @constructor
     */
    function MerchantRepository() {
      this.$$entityName = 'merchant';
    }

    /**
     *
     * @type MerchantRepository
     * */
    MerchantRepository.prototype = {

      DISTRIBUTION_LISTS:{
        EMAIL: 'EMAIL',
        SMS: 'SMS'
      },

      /**
       * @method
       * @description
       * Get current merchant detailed info
       * @return {promise}
       */
      getCurrentMerchant: function () {
        return this.$find(userService.getUser().id);
      },

      $$parseResponse: function (data) {
        if (data.merchants) {
          return data.merchants;
        }
        if (data.merchant) {
          return data.merchant;
        }
      },

      getCurrentMerchantId: function(){
        return userService.getUser().id;
      },

      /**
       * @method
       * @description
       * Get current merchant assigned locations
       * @param merchantId
       * @return {promise}
       */
      getMerchantLocations: function (merchantId) {
        return this.$getEM().$get({
          url: '/merchant/' + merchantId + '/locations',
          responseTransformer: 'locations'
        });
      },

      /**
       * @method
       * @description
       * Get merchant assigned locations
       * @return {promise}
       */
      getCurrentMerchantLocations: function () {
        return this.getMerchantLocations(userService.getUser().id);
      },

      /**
       * @method
       * @description
       * get user gallery images
       * @param  {string} id    Merchant id
       * @return {promise}
       */
      getGalleryImages: function (id) {
        return this.$getEM().$post({
          url: '/gallery/list',
          responseTransformer: 'galleryItem',
          data: {
            merchantId: id
          }
        });
      },

      /**
       * @method
       * @description
       * get user gallery images
       * @return {promise}
       */
      getCurrentMerchantGalleryItems: function () {
        return this.getGalleryImages(userService.getUser().id);
      },
      /**
       * @method
       * @param {string} id
       * @param {ImageEntity} image
       * @return {promise | Promise}
       */
      addUploadedImageToGallery: function (image) {
        //if (image.isNew()){
        //  return $q.reject({type: 'error', message: 'Image should be uploaded first'});
        //}
        return this.$getEM().$post({
          url: '/gallery/add',
          responseTransformer: 'galleryItem',
          requestTransformer: 'galleryItem',
          data: image
        });
      },

      /**
       * @method
       * @description
       * @param  {string | ImageEntity} image
       * @return {promise}
       */
      removeFromGallery: function (image) {
        return this.$getEM().$delete({
          url: '/gallery/' + (image.id || image),
          responseTransformer: 'galleryItem',
          data: {
            merchantId: userService.getUser().id
          }
        });
      },

      /**
       * @method
       * @param id
       * @param type
       * @return {promise}
       */
      getDistributionList: function(id, type){
        return this.$getEM().$get({
          url: '/distribution/' + id + '/list/' + type.toUpperCase(),
          data: {
            merchantId: userService.getUser().id
          }
        })
          .then(function (data) {
            return data.distributionLists;
          });
      },

      /**
       * @method
       * @param type
       * @return {promise}
       */
      getCurrentMerchantDistributionList: function(type) {
        return this.getDistributionList(userService.getUser().id, type);
      },

      saveCurrentMerchantDistributonChannelList: function(list){
        list.merchantId = list.merchantExtId = list.merchant_id  = this.getCurrentMerchantId();
        var method = list.id ? '$put' : '$post';
        return this.$getEM()[method]({
          url: '/distribution/list/',
          data: list
        }).then(function(entity){
          return angular.extend(entity,list);
        });
      },

      deleteCurrentMerchantDistributonChannelList: function(list){
        return this.$getEM().$delete({
          url: '/distribution/list/',
          data: {
            merchantId: this.getCurrentMerchantId(),
            id: list.id || list
          }
        });
      },

      getCurrentMerchantDistributonChannelRecepients: function(id){
        return this.$getEM().$get({
          url: '/distribution/'+this.getCurrentMerchantId()+'/list/'+id+'/recipient',
          responseTransformer: 'distribitionRecepient'
        })
          .then(function (result) {
            var data = [];
            angular.forEach(result, function(item){
              item.distributionListId =  id;
              data.push(item);
            });
            return data;
          });
      },
      saveCurrentMerchantDistributonChannelRecepient: function(recepient){
        var method = recepient.id ? '$put' : '$post';
        return this.$getEM()[method]({
          url: '/distribution/recipient/',
          responseTransformer: 'distribitionRecepient',
          requestTransformer: 'distribitionRecepient',
          data: recepient
        }).then(function(entity){
          return angular.extend(entity,recepient);
        });
      },
      deleteCurrentMerchantDistributonChannelRecepient: function(recepient){
        return this.$getEM().$delete({
          url: '/distribution/recipient/',
          data: {
            id: recepient.id || recepient,
            merchantId: this.getCurrentMerchantId()
          }
        });
      }

    };
    PPRepository.extend(MerchantRepository);
    return MerchantRepository;
  }
);
