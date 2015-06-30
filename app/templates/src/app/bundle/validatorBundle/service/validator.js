/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.validatorBundle')
    .provider('validator', function () {

        var schemas = {};

        this.add = function (name, schema) {
            schemas[name] = schema;
            return this;
        };

        this.addCollection = function (col) {
            var self = this;
            angular.forEach(col, function (schema, type) {
                self.add(type, schema.validators || schema);
            });
        };

        this.remove = function (name) {
            delete schemas[name];
            return this;
        };


        this.has = function (name) {
            return schemas[name] !== undefined;
        };

        this.get = function (name) {
            return schemas[name] || {};
        };

        var provider = this;


        this.$get =
          /**
           *
           * @param $q
           * @param {ObjectValidator} objectValidator
           * @param {FormValidator} formValidator
           * @param {ValidatorRulesCollection} validatorRulesCollection
           */
          function ($q, objectValidator, formValidator, validatorRulesCollection) {
            /**
             * @class
             * @constructor
             */
            function Validator() {
            }

            /**
             *
             * @type Validator
             */
            Validator.prototype = {
                add: function add(name, schema) {
                    provider.add(name, schema);
                    return this;
                },
                remove: function remove(name) {
                    provider.remove(name);
                    return this;
                },
                has: function has(name) {
                    return provider.has(name);
                },
                get: function get(name) {
                    return provider.get(name);
                },
                addRule: function addRule(name, rule) {
                    validatorRulesCollection.add(name, rule);
                    return this;
                },
                removeRule: function removeRule(name) {
                    validatorRulesCollection.remove(name);
                    return this;
                },
                hasRule: function hasRule(name) {
                    return validatorRulesCollection.has(name);
                },
                getRule: function getRule(name) {
                    return validatorRulesCollection.get(name);
                },

                getValidationRules: function getValidationRules(schema) {
                    schema = angular.isFunction(schema) ? this.get(schema.constructor.name) : schema;
                    schema = angular.isString(schema) ? this.get(schema) : schema;
                    return schema;
                },
                validate: function validate(object, schema) {
                    schema = angular.isObject(schema) ? schema : this.getValidationRules(schema || object);
                    return objectValidator.validateAll(object, schema);
                },
                validateField: function validateField(object, fields, schema) {
                    var fieldNames = angular.isString(fields) ? [fields] : fields;
                    return objectValidator.validateFields(object, fieldNames, this.getValidationRules(schema || object));
                },
                validateFormField: function (viewValue, modelValue, model, field, schema) {
                    return formValidator.validateField(viewValue, modelValue, model, field, schema);
                }
            };

            return new Validator();
        };
    });
