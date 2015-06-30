/**
 * @ngdoc service
 * @name BaseEntity
 * @description
 * This Class is wrapper for objects returned from service.
 * It's contains some helpful methods, and it is base Class for all other entities.
 * */
'use strict';
angular.module('EntityBundle')
  .factory('BaseEntity', [function () {

    /**
     * @ngdoc type
     * @name BaseEntity
     * @description
     * This Class is wrapper for objects returned from service.
     * It's contains some helpful methods, and it is base Class for all other entities.
     * Creates a new EntityManager that operates on the given API connection and uses the given Configuration.
     * @constructor
     *
     */
    function BaseEntity() {
      /**
       * @description get first argument as init data
       */
      this.$construct(arguments[0] || null);
    }

    BaseEntity.prototype = {

      /**
       * @ngdoc method
       * @name BaseEntity#$setEndpoint
       * @description
       * fill object with default and init data. Should be called inside constructor of child classes
       * can be used as
       * function ChildEntity(data) {
       *      this.$construct(data || null);
       *  }
       *
       *  or
       *
       *  BaseEntity.prototype.$construct.apply(this, arguments);
       * @param {object | Array} properties
       * @this BaseEntity
       * @return {this}
       */
      $construct: function (properties) {
        var defaults = this.$getDefaults();
        if (defaults) {
          angular.extend(this, defaults);
        }
        if (properties) {
          angular.extend(this, properties);
        }
        return this;
      },

      /**
       * @ngdoc method
       * @name BaseEntity#$getId
       * @description Get current Entity Id
       * @this BaseEntity
       * @return {string|undefined}
       */
      $getId: function () {
        /**
         * currently it a bit redundant. It cover classic id, MongoDBRef and MongoDB
         */
        var id = this.id || this._id;
        return angular.isObject(id) ? id.$oid : id;
      },

      /**
       * @ngdoc method
       * @name BaseEntity#$getIgnoreFields
       * @deprecated
       * Please use data transformers instead
       * @description
       * This fields will be ignored when object will transferred to server
       * @this BaseEntity
       * @return {Array}
       */
      $getIgnoreFields: function () {
        return this._ignoreFields;
      },

      /**
       * @ngdoc method
       * @name BaseEntity#$getDefaults
       * @deprecated
       * Please use data class constructor instead
       * @description
       * default values
       * @this BaseEntity
       * @return {object}
       */
      $getDefaults: function () {
        return {};
      },

      /**
       * @ngdoc method
       * @name BaseEntity#$getPureEntity
       * @deprecated
       * Please use data transformers instead
       * @description
       * return object without ignored fields
       * @this BaseEntity
       * @return {object}
       */
      $getPureEntity: function () {
        var ignoreFields = this.$getIgnoreFields();
        if (ignoreFields && ignoreFields.length > 0) {
          var copy = angular.extend(this);

          angular.forEach(ignoreFields, function (value) {
            delete copy[value];
          });
          return copy;
        }
        return this;
      },

      /**
       * @ngdoc method
       * @name BaseEntity#toJSON
       * @deprecated
       * Please use data transformers instead
       * @description
       * The counterpart to parse.
       * Override it to filter or cast the properties for use in json.
       * @this BaseEntity
       * @return {object}
       */
      toJSON: function () {
        return this.$getPureEntity();
      }
    };

    /**
     * @ngdoc property
     * @name BaseEntity#repository
     * @static
     * @property {string | Function}    repository
     * @description
     * Repository which will manage this entity type.
     * If string then AngularJS DI container will be used, else could be the Class.
     * @this BaseEntity
     */
    BaseEntity.repository = 'BaseEntityRepository';

    BaseEntity.getValidationSchema = function(){
      return this.schema || {};
    };

    /**
     * @ngdoc method
     * @name BaseEntity#extend
     * @static
     * @description
     * Custom implementation of OOP inhering
     * BaseEntity.prototype.parentMethod.apply(this, arguments);
     * @param {function}     ChildClass
     * @returns {function}     Class
     */
    BaseEntity.extend = function (ChildClass) {
      var BaseClass = this;
      angular.extend(ChildClass, BaseClass);
      ChildClass.prototype = !ChildClass.prototype ? new BaseClass() : angular.copy(ChildClass.prototype, new BaseClass());
      return ChildClass;
    };
    return BaseEntity;
  }]);
