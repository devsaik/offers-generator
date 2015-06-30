/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('ChannelBundle')
  .factory('ChannelEntity',
  /**
   *
   * @param {BaseEntity} BaseEntity
   * @param moment
   * @param {Validator} validator
   * @param appConfig
   * @return {ChannelEntity}
   */
  function (BaseEntity) {

    /**
     * @class
     * @constructor
     */
      function ChannelEntity() {
        BaseEntity.prototype.$construct.apply(this, arguments);
      }


    /**
     *
     * @type ChannelEntity
     */
      ChannelEntity.prototype = {
        getType: function() {
          return this.type;
        }
      };

      BaseEntity.extend(ChannelEntity);

      return ChannelEntity;
    }
  );
