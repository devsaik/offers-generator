/**
 * @ngdoc service
 * @name BaseEntity
 * @description
 * This Class is wrapper for objects returned from service.
 * It's contains some helpful methods, and it is base Class for all other entities.
 * */
'use strict';
angular.module('OfferBundle')
  .factory('OfferEntity',
  /**
   *
   * @param {BaseEntity} BaseEntity
   * @param moment
   * @param {Validator} validator
   * @param appConfig
   * @param {Channels} channels
   * @param $q
   * @param {PPEntityManager} ppEntityManager
   * @return {OfferEntity}
   */
  function (BaseEntity, moment, validator, appConfig, channels, $q, ppEntityManager) {

      /**
       * @ngdoc type
       * @class
       * @extends BaseEntity
       * @classdesc
       * This is offer entity
       * @constructor
       *
       */
      function OfferEntity(data) {
        //this.discountType = 'PERCENTAGE';
        data.$$status = data.status;
        this.$construct(data || null);
      }


      /**
       *
       * @type OfferEntity
       * */
      OfferEntity.prototype = {
        /**
         * @ngdoc method
         * @name OfferEntity#setStatus
         * @description
         * Try to change offer status
         * @param {string} val
         * @return {boolean | this}
         */
        setStatus: function (val) {
//          val = val || 'INCOMPLETE';
          if (this.canTransitToStatus(val)) {
            this.$$status = this.status;
            this.status = (val && val.toUpperCase) ? val.toUpperCase() : val;
            return this;
          }
          return false;
        },

        /**
         * @ngdoc method
         * @name OfferEntity#canTransitToStatus
         * @description
         * Check if offer status could be changed
         * @param {string} status
         * @return {boolean}
         */
        canTransitToStatus: function (status) {
          try {
            var rule = validator.getRule('offer_status_map');
            var opt = validator.get('offer').status.offer_status_map;
            rule.validate(status, this, opt);
          } catch (e) {
            return false;
          }
          return true;
        },

        isActive: function(){
            return this.isStatus('RUNNING') && this.shortUrl !== undefined;

        },

        /**
         * @ngdoc method
         * @name OfferEntity#getNextStatus
         * @description
         * return next status by the offer change status workflow
         * @return {string}
         */
        getNextStatus: function () {
          return appConfig.ENTITY.offer.status_default_flow[this.status.toLowerCase()];
        },

        /**
         * @ngdoc method
         * @name OfferEntity#getStatus
         * @description
         * gets current offer status
         * @return {string}
         */
        getStatus: function () {
          return this.status;
        },

        /**
         * @ngdoc method
         * @name OfferEntity#toJSON
         * @description
         * small cleanup on serialization
         * @return {object}
         */
        toJSON: function () {
          var obj = angular.copy(this);
          if (obj.discount.discountType !== 'BUYGET') {
            delete obj.discount.buy;
            delete obj.discount.get;
          }
          if (obj.discount.discountType === 'ABSOLUTE') {
            delete obj.discount.maxAmount;
          }
          if (obj.discount.discountType === 'BUYGET') {
            delete obj.discount.maxAmount;
            delete obj.discount.minAmount;
            delete obj.discount.amount;
          }
          if (obj.discount.discountType === 'FREE') {
            delete obj.discount.amount;
            delete obj.discount.maxAmount;
          }
          return obj;
        },

        /**
         * @ngdoc method
         * @name OfferEntity#getChannelIdByType
         * @description
         * get assigned channel ID by it Type
         * @return {string | undefined}
         */
        getChannelIdByType: function(typeName){
          var channel = _.find(this.channels, {type: typeName.toUpperCase()});
          return channel ? channel.id : undefined;
        },

        /**
         * @ngdoc method
         * @name OfferEntity#getChannelStatistic
         * @description
         * get assigned channel statistic by channel Type
         * @return {Promise}
         */
        getChannelStatistic: function(){
          return ppEntityManager.$getRepository('OfferRepository')
            .getOfferStatistics(this);

          //todo tempary disabled
          //var channel = _.find(this.channels, {type: typeName.toUpperCase()});
          //if (!channel) {
          //  return $q.reject({type:'error', message: 'No avaliable'});
          //}
          //return channels.getChannelStatistic(channel);
        },


        /**
         * @ngdoc method
         * @name OfferEntity#getChannelStatistic
         * @description
         * Link channel with current offer
         * @param channel
         * @returns {Promise}
         */
        addChannel: function addChannel(channel){
          //@todo check if target channel in not already added
          return channels.linkToOffer(channel, this);
        },

        /**
         * @method
         * @description
         * Return boolean value: can edit offer or no
         * @returns {boolean}
         */
        isEditable: function() {
          return !this.hasOwnProperty('status') ? true : ['incomplete', 'pending', 'rejected', 'running', 'paused'].indexOf(this.status.toLowerCase()) !== -1;
        },

        isStatusSameAs: function(){

        },

        /**
         * @method
         * @description
         * Return spend for all channels of this offer
         * @return {number}
         */
        getTotalSpend: function(){
          var result = 0;
          if (this.channels){
            angular.forEach(this.channels, function(channel){
              if (['ARCHIVED', 'EXPIRED'].indexOf(channel.status) !== -1){
                result += channel.spend;
              } else if (['RUNNING', 'PENDING', 'PAUSED'].indexOf(channel.status) !== -1){
                result += channel.budget;
              }
            });
          }
          return result;
        },

        /**
         * @method
         * @param {string} fieldName
         * @description
         * Is ofer field can be editable/readonly
         * @returns {boolean}
         */
        isFieldReadonly: function (fieldName) {
          if (!this.hasOwnProperty('status')) {
            return false;
          }
          var enabledFields = {
            pending: ['redemptionTarget'],
            rejected: ['redemptionTarget'],
            running: ['redemptionTarget'],
            paused: ['redemptionTarget'],
            expired: [],
            archived: []
          };
          if (!enabledFields[this.status.toLowerCase()]){
            return false;
          }
          return enabledFields[this.status.toLowerCase()].indexOf(fieldName) === -1;
        },

        isStatus: function(status){
          var sameStatusMap = {
            running: ['rejected']
          };
          if (this.status.toUpperCase() !== status.toUpperCase()){
            if (sameStatusMap[status.toLowerCase()] ){
              return sameStatusMap[status.toLowerCase()].indexOf(this.status.toLowerCase()) !== -1;
            } else {
              return false;
            }
            //return sameStatusMap[status.toLowerCase()] ? sameStatusMap[status.toLowerCase()].indexOf(this.status.toLowerCase()) === -1 : false;
          }
          return true;
        }

      };

      BaseEntity.extend(OfferEntity);

//      Object.defineProperty(OfferEntity.prototype, 'status', {
//        get: this.getStatus,
//        set: this.setStatus,
//        configurable: false });




      return OfferEntity;
    });
