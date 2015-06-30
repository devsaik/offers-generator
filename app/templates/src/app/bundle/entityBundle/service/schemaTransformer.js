/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
/**
 * @name validator
 * @description
 * validator service used by EntityBundle to validate any kind of objects. it use angular-form-for validation as core
 */
angular.module('EntityBundle')
  .factory('schemaTransformer', function ($parse) {
    function SchemaTransformer(schema) {
      this.schema = schema;
    }

    SchemaTransformer.prototype = {
      $$doTransform: function (object, schema) {
        var dto = {};

        if (schema.__copy) {
          angular.forEach(schema.__copy, function (fieldName) {
            dto[fieldName] = object[fieldName];
          });
          //delete schema.__copy;
        }

        //console.log(object);
        angular.forEach(schema, function (path, key) {
          var value = null; //$parse(path)(object)
          try {
            value = $parse(path)(object);
            if (value === undefined){
              throw new Error();
            }
          } catch (e) {
            try {
              value = eval(path);
              //console.log(value);
            }
            catch(b){
              console.log(b);
              value = undefined;
            }
          }


          $parse(key).assign(dto, value);
        });
        delete dto.__copy;
        delete dto.__prefix;
        return dto;
      },

      $transform: function transform(object) {
        var schema = angular.copy(this.schema.response || this.schema.to || this.schema);
        if (schema.__prefix) {
          object = $parse(schema.__prefix)(object) || object;
          //delete schema.__prefix;
        }
        if (angular.isArray(object)) {
          var result = [];
          angular.forEach(object, function (o) {
            result.push(this.$$doTransform(o, schema));
          }, this);
          return result;
        }
        return this.$$doTransform(object, schema);
      },

      $reverseTransform: function reverseTransform(object) {
        var schema = angular.copy(this.schema.request || this.schema.from || this.schema);
        if (schema.__prefix) {
          object = $parse(schema.__prefix)(object) || object;
          //delete schema.__prefix;
        }
        if (angular.isArray(object)) {
          var result = [];
          angular.forEach(object, function (o) {
            result.push(this.$$doTransform(o, schema));
          }, this);
          return result;
        }
        return this.$$doTransform(object, schema);
      }
    };


    SchemaTransformer.$create = function (schema) {
      return new SchemaTransformer(schema);
    };

    return SchemaTransformer;
  });
