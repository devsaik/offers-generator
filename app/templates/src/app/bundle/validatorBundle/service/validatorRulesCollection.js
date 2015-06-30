/**
 * @ngdoc Services
 * @name ValidatorRulesCollection
 * @description
 * ValidatorRulesCollection service used by EntityBundle to manage validation rules by name.
 */
'use strict';
angular.module('df.validatorBundle')
  .service('validatorRulesCollection', function ValidatorRulesCollection($q, defaultValidationRules) {
    var validators = {};

    /**
     * Use this method to add new rule to the validation collection.
     * @memberof ValidatorRulesCollection
     */
    this.add = function (name, rule) {
      if (angular.isFunction(rule)) {
        rule = {
          message: 'Invalid value',
          validate: rule
        };
      }
      if (!angular.isFunction(rule.validate)) {
        throw 'Invalid validator object type';
      }
      validators[name] = rule;
      return this;
    };

    /**
     * Use this method to remove existed rule from the validation collection.
     * @memberof ValidatorRulesCollection
     */
    this.remove = function (name) {
      delete validators[name];
      return this;
    };

    /**
     * Use this method to check is rule existe inside the validation collection.
     * @memberof ValidatorRulesCollection
     */
    this.has = function (name) {
      return validators[name];
    };

    /**
     * Use this method to get the rule from the validation collection.
     * @memberof ValidatorRulesCollection
     */
    this.get = function (name) {
      return validators[name];
    };
//---- add pre defined validator rules to the validation collection
    var self = this;
    angular.forEach(defaultValidationRules, function (rule, name) {
      self.add(name, rule);
    });

  });