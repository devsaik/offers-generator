'use strict';
/**
 * @ngdoc service
 * @name dataTransformer
 * @description
 * This service is collection of named registered data transformers. They used to transform responses\requests
 * */
angular.module('EntityBundle')
  .service('dataTransformer', function ($injector) {

    /**
     * @ngdoc type
     * @name DataTransformer
     * @description
     * This service is collection of named registered data transformers. They used to transform responses\requests or
     * can transform any data in both or only one direction.
     * @constructor
     *
     */
    function DataTransformer() {

    }

    /**
     * @description collection of transformers
     * @private
     * @type {*}
     */
    var transformer_collection = {};

    DataTransformer.prototype = {
      /**
       * @ngdoc method
       * @name DataTransformer#$add
       * @description add new data trasformer
       * @this  DataTransformer
       * @param {string}      name
       * @param {function | object | string} transformer             service name, or function or object
       * @param {function}          transformer.$transform           function which will transform data in main (serialize) or in both (deserialize) ways
       * @param {function}          transformer.$reverseTransform    function which will transform data in reverse way (deserialize)
       * @return {DataTransformer}
       */
      $add: function add(name, transformer) {
        transformer_collection[name] = transformer;
        return this;
      },

      /**
       * @ngdoc method
       * @name DataTransformer#$get
       * @description return registered transformer
       * @this  DataTransformer
       * @param {string} name
       * @return {object | function}
       */
      $get: function get(name) {
        var transformer = transformer_collection[name];
        if (angular.isString(transformer)) {
          try {
            transformer = $injector.get(transformer);
          } catch (e) {
            throw e;
          }
        }
        return transformer;
      },

      /**
       * @ngdoc method
       * @name DataTransformer#$has
       * @description is transformer registered
       * @this  DataTransformer
       * @param {string} name
       * @return {boolean}
       */
      $has: function has(name) {
        return transformer_collection[name] !== undefined;
      },

      /**
       * @ngdoc method
       * @name DataTransformer#$remove
       * @description remove transformer from collection
       * @this  DataTransformer
       * @param {string}      name
       * @return {DataTransformer}
       */
      $remove: function remove(name) {
        delete transformer_collection[name];
        return this;
      },

      /**
       * @ngdoc method
       * @name DataTransformer#$transform
       * @description transform data
       * @this  DataTransformer
       * @param {string}      name      transformer name
       * @param {*}           object    data to transform
       * @return {*}
       */
      $transform: function transform(name, object) {
        if (!this.$has(name)) {
          return object;
        }

        var transformer = this.$get(name);
        if (angular.isFunction(transformer)) {
          return transformer(object);
        }
        if (angular.isObject(transformer) && angular.isFunction(transformer.$transform)) {
          return transformer.$transform(object);
        }

        return object;
      },

      $chainTransform: function chainTransform(chain, object) {
        if (angular.isString(chain)) {
          chain = chain.split(/[\s,]+/);
        }
        var result = object;
        for (var i = 0; i < chain.length; i++) {
          result = this.$transform(chain[i], result);
        }
        return result;
      },


      $chainReverseTransform: function chainReverseTransform(chain, object) {
        if (angular.isString(chain)) {
          chain = chain.split(/[\s,]+/);
        }
        var result = object;
        for (var i = 0; i < chain.length; i++) {
          result = this.$reverseTransform(chain[i], result);
        }
        return result;
      },


      /**
       * @ngdoc method
       * @name DataTransformer#$reverseTransform
       * @description transform data second way
       * @this  DataTransformer
       * @param {string}      name      transformer name
       * @param {*}           object    data to transform
       * @return {*}
       */
      $reverseTransform: function reverseTransform(name, object) {
        if (!this.$has(name)) {
          return object;
        }

        var transformer = this.$get(name);
        if (angular.isFunction(transformer)) {
          return transformer(object);
        }
        if (angular.isObject(transformer) && angular.isFunction(transformer.$reverseTransform)) {
          return transformer.$reverseTransform(object);
        }

        return object;
      }
    };

    return new DataTransformer();
  });
