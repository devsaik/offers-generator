/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfValidator',
  /**
   *
   * @param dfFormUtils
   * @param $parse
   * @param {ValidatorRulesCollection} validatorRulesCollection
   */
  function (dfFormUtils, $parse, validatorRulesCollection, $q) {
    function isPromiseLike(obj) {
      return obj && angular.isFunction(obj.then);
    }

    return {
      restrict: 'EA',
      require: ['^ngModel', '^?form'],
      scope: false,
      link: function post(scope, element, attrs, ctrls) {
        var ngForm = ctrls[1];
        var ngModel = ctrls[0];

        ngModel.$errorMessages = ngModel.$errorMessages || {};
        angular.forEach(attrs, function (options, key) {
          if (key.indexOf('df') !== 0) {
            return;
          }

          var validatorName = key.replace('df', '');
          validatorName = validatorName.substr(0, 1).toLowerCase() + validatorName.substr(1);
          if (!validatorRulesCollection.has(validatorName)){
            if (validatorName === 'linkedWith'){

            }
            return;
          }

          var validator = validatorRulesCollection.get(validatorName);

          ngModel.$asyncValidators[validatorName] = function (modelValue, viewValue) {
            var context = ngForm && ngForm.object ? ngForm.object : ngModel;
            if (ngModel.isDisabled && ngModel.isDisabled()){
              delete ngModel.$errorMessages[validatorName];
              return $q.resolve();
            }
            var result;
            try {
              result = validator.validate(viewValue, context, scope.$eval(options));
            } catch (e) {
              ngModel.$errorMessages[validatorName] = e.toString();
              return $q.reject(e.toString());
            }

            if (isPromiseLike(result)) {
              return result.then(function(){
                delete ngModel.$errorMessages[validatorName];
                return $q.resolve();
              }).catch(function(e){
                ngModel.$errorMessages[validatorName] = e.toString();
                return $q.reject(e.toString());
              });
            }

            if (result){
              delete ngModel.$errorMessages[validatorName];
              return $q.resolve();
            } else {
              ngModel.$errorMessages[validatorName] = result.toString();
              return $q.reject();
            }
          };

        });
      }
    };
  });
