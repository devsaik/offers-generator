'use strict';
/**
 * @ngdoc service
 * @name AdRepository
 * @description
 * Ad Repository
 * */
angular.module('ChannelBundle')
  .factory('AdRepository',
  /**
   *
   * @param PPRepository
   * @param AdEntity
   * @param $q
   * @param {UserService} userService
   * @return {AdRepository}
   */
    function (PPRepository, AdEntity, $q, userService) {

    /**
     * @ngdoc type
     * @class
     * @extends PPRepository
     * @description
     * This is Ad Repository
     * @constructor
     *
     */
      function AdRepository() {
        this.$$entityName = 'ad';
        this.$$entityType = AdEntity;
      }

    /**
     *
     * @type AdRepository
     */
      AdRepository.prototype = {
        /**
         * @param {AdEntity | object} entity
         * @param {*} options
         * @return {promise}
         */
        $save: function (entity, options) {
          options = options || {
            requestTransformer: 'displayAd'
          };
          options.url = '/ad';
          entity.name = entity.name || entity.title || 'new_offer';
          return PPRepository.prototype.$save.call(this, entity, options)
            .then(function(response){
              entity.id = response.id;
              return $q.resolve(entity);
          })
            .catch(function(e){
              return $q.reject(e);
            });
        },

        /**
         *
         * @param {string}    id
         * @param {*}         options
         * @return {promise}
         */
        $find: function (id, options) {
          options = options || {
            responseTransformer: 'displayAd'
          };
          return PPRepository.prototype.$find.call(this, id, options);
        },
        /**
         *
         * @param {*}     criteria
         * @param {*}     options
         * @return {promise}
         */
        $findOneBy: function (criteria, options) {
          options = options || {
            responseTransformer: 'displayAd'
          };
          return PPRepository.prototype.$findOneBy.call(this, criteria, options);
        },
        /**
         *
         * @param {*}     criteria
         * @param {*}     options
         * @return {promise}
         */
        $findBy: function (criteria, options) {
          options = options || {
            responseTransformer: 'displayAd'
          };
          return PPRepository.prototype.$findBy.call(this, criteria, options);
        },

        /**
         * @method
         * @description
         * gets the list of available ADs for current merchant
         * @return {promise}
         */
        getCurrentMerchantAds: function(){
          return this.$getEM().$get({
            url: '/merchant/'+ userService.getMerchantId() +'/ads',
            responseTransformer: 'displayAd'
          });
        },


        /**
         * @method
         * @description
         * gets the list of available ADs for current merchant
         * @return {promise}
         */
        getCurrentMerchantImages: function(){
          return this.$getEM().$get({
            url: '/gallery/list',
            responseTransformer: 'galleryItems'
          });
        }
      };
      PPRepository.extend(AdRepository);


      return AdRepository;
    }

);
