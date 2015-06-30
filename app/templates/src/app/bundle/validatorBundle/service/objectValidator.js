/**
 * Created by nikita on 12/29/14.
 */

'use strict';
angular.module('df.formBundle')
  .service('objectValidator',
  /**
   *
   * @param $q
   * @param dfValidationUtils
   * @param $parse
   * @param {ValidatorRulesCollection} validatorRulesCollection
   */
  function ($q, dfValidationUtils, $parse, validatorRulesCollection) {
    /**
     * @class
     * @constructor
     */
    function ObjectValidator() {

    }

    /**
     *
     * @type ObjectValidator
     */
    ObjectValidator.prototype = {
      /**
       * @method
       * @description
       * Strip array brackets from field names so that object values can be mapped to rules.
       * For instance:
       * 'foo[0].bar' should be validated against 'foo.collection.fields.bar'.
       */
      $getRulesForFieldName: function (validationRules, fieldName) {
        fieldName = fieldName.replace(/\[[^\]]+\]/g, '.collection.fields');
        return $parse(fieldName)(validationRules);
      },
      /**
       * @method
       * @description
       * Validates the object against all rules in the validationRules.
       * This method returns a promise to be resolved on successful validation,
       * Or rejected with a map of field-name to error-message.
       * @param {Object} object Form-data object object is contained within
       * @param {Object} validationRules Set of named validation rules
       * @returns {Promise} To be resolved or rejected based on validation success or failure.
       */
      validateAll: function (object, validationRules) {
        var fields = dfValidationUtils.flattenObjectKeys(validationRules);
        return this.validateFields(object, fields, validationRules);
      },


      /**
       * @method
       * @description
       * Validates the values in object with the rules defined in the current validationRules.
       * This method returns a promise to be resolved on successful validation,
       * Or rejected with a map of field-name to error-message.
       * @param {Object} object Form-data object object is contained within
       * @param {Array} fieldNames Whitelist set of fields to validate for the given object; values outside of this list will be ignored
       * @param {Object} validationRules Set of named validation rules
       * @returns {Promise} To be resolved or rejected based on validation success or failure.
       */
      validateFields: function (object, fieldNames, validationRules) {
        validationRules = angular.copy(validationRules);
        var deferred = $q.defer();
        var promises = [];
        var errorMap = {};

        angular.forEach(fieldNames, function (fieldName) {
          var rules = this.$getRulesForFieldName(validationRules, fieldName);

          if (rules) {
            var promise;

            promise = this.validateField(object, fieldName, validationRules);

            promise.then(
              angular.noop,
              function (error) {
                $parse(fieldName).assign(errorMap, error);
              });

            promises.push(promise);
          }
        }, this);

        $q.all(promises).then(
          deferred.resolve,
          function () {
            deferred.reject(errorMap);
          });

        return deferred.promise;
      },

      /**
       * @method
       * @param object
       * @param fieldName
       * @param validationRules
       * @return {*}
       */
      validateField: function (object, fieldName, validationRules) {
        var rules = this.$getRulesForFieldName(validationRules, fieldName);
        var value = $parse(fieldName)(object);
        //var validationPromises = [];
        if (angular.isString(value)) {
          value = value.replace(/\s+$/, '');
        }
        var defer = $q.defer();


        (function shiftRule(rules) {
          //var rule = rules.shift();

          function processRule(rule) {
            var returnValue;
            if (validatorRulesCollection.has(rule.name)) {
              var validationRule = validatorRulesCollection.get(rule.name);
              var ruleOptions = rule;

              try {
                returnValue = validationRule.validate(value, object, ruleOptions);
              } catch (error) {
                return $q.reject(error || validationRule.message);
              }

              if (angular.isObject(returnValue) && angular.isFunction(returnValue.then)) {
                return returnValue.then(
                  function (reason) {
                    return $q.when(reason);
                  },
                  function (reason) {
                    return $q.reject(reason || validationRule.message);
                  });
              } else if (returnValue) {
                return $q.when(returnValue);
              } else {
                return $q.reject(validationRule.message);
              }
            }
            return $q.reject('Unknown validation rule with name ' + rule.name);
          }

          return processRule(rules)
            .then(function () {
              if (rules.length === 0) {
                return defer.resolve();
              }
              return shiftRule(rules);
            })
            .catch(defer.reject);


        }(rules));

        return defer.promise;
      },

      /**
       * Convenience method for determining if the specified collection is flagged as required (aka min length).
       */
      isCollectionRequired: function (fieldName, validationRules) {
        var rules = this.$getRulesForFieldName(validationRules, fieldName);

        return rules &&
          rules.collection &&
          rules.collection.min &&
          (angular.isObject(rules.collection.min) ? rules.collection.min.rule : rules.collection.min);
      },

      /**
       * Convenience method for determining if the specified field is flagged as required.
       */
      isFieldRequired: function (fieldName, validationRules) {
        var rules = this.$getRulesForFieldName(validationRules, fieldName);

        return rules &&
          rules.required &&
          (angular.isObject(rules.required) ? rules.required.rule : rules.required);
      }

    };

    return new ObjectValidator();
  })
;
