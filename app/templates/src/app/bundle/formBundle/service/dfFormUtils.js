/**
 * Created by nikita
 */
'use strict';
(function () {

  /**
   * Some of the code below was filched from https://github.com/angular/material
   */
  /*
   * This var has to be outside the angular factory, otherwise when
   * there are multiple apps on the same page, each app
   * will create its own instance of this array and the app's IDs
   * will not be unique.
   */
  var nextUniqueId = ['0', '0', '0'];
  angular.module('df.formBundle')
    .service('dfFormUtils', function (validator, $q) {
      function DfFormUtils() {

      }

      DfFormUtils.prototype = {

        /**
         * nextUid, from angular.js.
         * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
         * characters such as '012ABC'. The reason why we are not using simply a number counter is that
         * the number string gets longer over time, and it can also overflow, where as the nextId
         * will grow much slower, it is a string, and it will never overflow.
         *
         * @returns an unique alpha-numeric string
         */
        nextUid: function nextUid() {
          var index = nextUniqueId.length;
          var digit;

          while (index) {
            index--;
            digit = nextUniqueId[index].charCodeAt(0);
            digit=parseInt(digit);
            if (digit === 57 /*'9'*/) {
              nextUniqueId[index] = 'A';
              return nextUniqueId.join('');
            }
            if (digit === 90  /*'Z'*/) {
              nextUniqueId[index] = '0';
            } else {
              nextUniqueId[index] = String.fromCharCode(digit + 1);
              return nextUniqueId.join('');
            }
          }
          nextUniqueId.unshift('0');
          return nextUniqueId.join('');
        },


        applyValidation: function (ngModel, form, scope) {
          var name = ngModel.$name;
          if (!name) {
            return;
          }
          if (scope) {
            scope.onValueChanged = function () {
              ngModel.$setDirty();
              ngModel.$setTouched();
            };
          }

          if (form && form.validationRules) {
            ngModel.$errorMessages = ngModel.$errorMessages || {};
            ngModel.$asyncValidators.dfForm = function (modelValue, viewValue) {
              if (ngModel.isDisabled && ngModel.isDisabled()){
                delete ngModel.$errorMessages.dfForm;
                return $q.resolve();
              }
              var qa = validator.validateFormField(viewValue, modelValue, form.object || form, name, form.validationRules);
              return qa.then(function () {
                delete ngModel.$errorMessages.dfForm;
                if (ngModel.$validationGroup && form.$validationGroups[ngModel.$validationGroup]){
                  var ngmodels = form.$validationGroups[ngModel.$validationGroup];
                  angular.forEach(ngmodels, function(ngmodel){
                    ngmodel.$setDirty();
                    ngmodel.$setTouched();
                  });
                }

                return true;
              }).catch(function (reason) {
                ngModel.$errorMessages.dfForm = reason.toString();
                return $q.reject(reason.toString());
              });
            };
          }
        },

        getMessageForError: function(name){
          var messages = {
            required: 'This field is required'
          };
          return messages[name] || 'Invalid Field';
        }
      };

      return new DfFormUtils();
    });
})();
