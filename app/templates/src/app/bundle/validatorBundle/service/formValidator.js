/**
 * Created by nikita on 12/29/14.
 */

'use strict';
angular.module('df.formBundle')
  .service('formValidator', function ($q, dfValidationUtils, $parse, validatorRulesCollection) {
    /**
     * @class
     * @constructor
     */
    function FormValidator() {

    }

    /**
     *
     * @type {FormValidator}
     */
    FormValidator.prototype = {
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
      validateAll: function () {
        throw 'Not Implemented';
        //var fields = dfValidationUtils.flattenObjectKeys(validationRules);
        //return this.validateFields(object, fields, validationRules);
      },

      /**
       * @method
       * @param {*} viewValue
       * @param {*} modelValue
       * @param {*} object
       * @param {string} fieldName
       * @param {*} validationRules
       * @return {promise}
       */
      validateField: function (viewValue, modelValue, object, fieldName, validationRules) {
        validationRules = angular.copy(validationRules);
        var rules = this.$getRulesForFieldName(validationRules, fieldName);
        var value = modelValue || viewValue;
       // var validationPromises = [];
        if (angular.isString(value)) {
          value = value.replace(/\s+$/, '');
        }
        if (!rules){
          return $q.resolve();
        }
        var defer = $q.defer();



        (function shiftRule(rules) {
          var rule = rules.shift();

          function processRule(rule) {
            var returnValue;
            if (validatorRulesCollection.has(rule.name)) {
              var validationRule = validatorRulesCollection.get(rule.name);

              try {
                returnValue = validationRule.validate(value, object, rule);
              } catch (error) {
                return $q.reject(error.message || error || validationRule.message);
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

          return processRule(rule)
            .then(function () {
              if (rules.length === 0) {
                return defer.resolve();
              }
              return shiftRule(rules);
            })
            .catch(defer.reject);


        }(rules));


        return defer.promise;
      }
    };

    return new FormValidator();
  })
;
