'use strict';
/**
 * @ngdoc service
 * @name cacheIt
 * @description
 * */
angular.module('EntityBundle')
  .service('cacheIt', function ($cacheFactory) {

    /**
     * @class
     * @constructor
     */
    function CacheIt() {
    }

    /**
     *
     * @type CacheIt
     */
    CacheIt.prototype = {
      /**
       *
       * @param tag
       * @return {Cache}
       */
      $$getTagStorage: function (tag) {
        try {
          return $cacheFactory.get('cacheIt-tag-' + tag) || $cacheFactory('cacheIt-tag-' + tag);
        } catch (e) {
          return $cacheFactory('cacheIt-tag-' + tag);
        }
      },
      $invalidate: function (tag, key) {
        if (key){

        }
        var tagStorage = this.$$getTagStorage(tag);
        if (key) {
          tagStorage.remove(key);
        } else {
          tagStorage.destroy();
        }
      },
      /**
       * @method
       * @param tag
       * @param key
       * @return {*}
       */
      $get: function (tag, key) {
        return this.$$getTagStorage(tag).get(key);
      },
      /**
       * @method
       * @param tag
       * @param key
       * @param value
       * @return {*}
       */
      $set: function (tag, key, value) {
        var tagStorage = this.$$getTagStorage(tag);
        return tagStorage.put(key, value);
      },
      /**
       * @method
       * @param tag
       * @param key
       * @return {boolean}
       */
      $has: function (tag, key) {
        return this.$get(tag, key) !== undefined;
      }
    };

    return new CacheIt();
  });
