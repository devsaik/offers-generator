/**
 * Created by Artyom on 2/13/2015.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfSelectbox', function (dfFormUtils, $timeout, $parse) {
    return {
      restrict: 'E',
      require: ['^ngModel', '^?form', '^?dfField'],
      transclude: true,
      controllerAs: 'vm',
      templateUrl: 'formBundle/templates/df-selectbox.html',
      scope: {
        value: '=ngModel',
        filter: '=?filter',
        onFilterChanged: '&',
        onItemSelected: '&',
        allowIcon: '=?',
        iconClass: '@?'
      },
      link: {
        pre: function (scope, element, attr, ctrl) {
          var disabledParsed = $parse(attr.ngDisabled);
          var ngModel = ctrl[0];
          var ngForm = ctrl[1];
          ngModel.isDisabled = scope.isDisabled = function () {
            return (ngForm && ngForm.dfDisabled) || disabledParsed(scope.$parent);
          };
          /**
           *
           * @type {
         * {
         *  show: boolean,
         *  selectElement: IAugmentedJQuery,
         *  listElement: IAugmentedJQuery,
         *  instanceId: string,
         *  type: ('selectbox' | 'multi' | undefined ),
         *  placeholder: string
         *  }
         * }
           */
          scope.view = {
            show: false,
            selectElement: angular.element(element)[0],
            listElement: angular.element(element).find('ng-transclude')[0],
            instanceId: 'inst-' + Date.now(), //what is this and why it necessary?????,
            type: attr.type || 'selectbox',
            placeholder: attr.placeholder,
            isEmptyAllowed: scope.$eval(attr.allowEmpty) === true,
            isFilterEnabled: scope.$eval(attr.allowFilter) === true,
            disabled: scope.disable
          };

          //if (scope.view.type === 'multi') {
          //}
          if (scope.view.isFilterEnabled) {
            scope.view.searhElement = angular.element(element).find('input')[0];
            scope.$watch('view.search', function (val) {
              scope.filter = val;
              scope.onFilterChanged({criteria: val});
            });
          }

          element.addClass('pp-selectbox');
          if (!attr.id) {
            element.attr('id', scope.view.instanceId);
          }

          for (var i = 0, elements = angular.element(element).children(); i < elements.length; i++) {
            if (angular.element(elements[i]).hasClass('select-input')) {
              scope.view.selectElement = elements[i];
              break;
            }
          }
        },
        post: function (scope, element, attrs, ctrl) {
          var dfField = ctrl[2];
          scope.ngModel = ctrl[0];
          if (dfField) {
            dfField.onWidgetAdded(scope.fid, scope.ngModel.$name, 'dfSelectbox');
          }
          dfFormUtils.applyValidation(ctrl[0], ctrl[1], scope);
        }
      },
      controller: function ($scope, $element, $document) {
        var vm = this;
        this.itemsList = {};
        $scope.selectedItems = {};

        function isInside(element) {
          if (element.length === 0) {
            return false;
          }
          return $scope.view.selectElement === element[0] ? true : isInside(element.parent());
        }

        $scope.$watch('value', function (value, oldValue) {
          if (undefined === value || value === oldValue) {
            return;
          }
          var selectedVals = vm.getValue();
          var tmpValue = [].concat(value);

          if (selectedVals.length === tmpValue.length && _.intersection(tmpValue, selectedVals).length === selectedVals.length) {
            vm.updateLabel();
            //$scope.ngModel.$validate();
            updateListControl();
            return;
          }

          $scope.selectedItems = {};

          angular.forEach(vm.itemsList, function (item) {
            var value = angular.element(item).scope().getItemValue();
            if (tmpValue.indexOf(value) !== -1) {
              selectItem(item);
            }
          });
          vm.updateLabel();
          updateListControl();
          //$scope.ngModel.$validate();

          //var idx = itemsValuesList.indexOf(value);
          //if (idx === -1) {
          //  $scope.selectedItems = {};
          //} else {
          //  selectItem(idx, value, itemsLabelList[idx]);
          //}
        });

        var clickHandler = function (e) {
          var $element = angular.element(e.target);
          var targetId = $element.attr('id');
          var isMulti = false;//;$scope.view.type === 'multi';
          if (targetId === $scope.view.instanceId || (isInside($element) && isMulti)) {
            return false;
          }
          $scope.view.show = false;
          $scope.$apply();
          unbindEvents();
        };

        var unbindEvents = function () {
          $scope.view.focus = -1;
          $document.unbind('click', clickHandler);
          $element.off('keydown', keyHandler);
          updateListControl();
        };

        /**
         * Handle keyboard key press
         * - if enter or space do the selection of the focused item form the list
         * - if down or up key arrow focus the appropriate item from the list
         *
         * @param e
         * @returns {boolean}
         */
        function keyHandler(e) {

          // enter
          if ([13].indexOf(e.keyCode) !== -1 && $scope.view.focus !== undefined) {

            //brutal hack goes here
            //angular.element(angular.element($scope.view.listElement).children()[$scope.view.focus]).click();

            selectItem(angular.element($scope.view.listElement).children()[$scope.view.focus]);
            updateListControl();
            vm.updateValue();
            //selectItem($scope.view.focus);


            //if ($scope.view.type !== 'multi') {
            //  unbindEvents();
            //  $scope.view.show = false;
            //}

            $scope.$apply();

            return false;
          }

          if ([38, 40].indexOf(e.keyCode) === -1) {
            return false;
          }

          var min = 0;
          var max = vm.getCurrentItemsLength() - 1;

          $scope.view.focus = $scope.view.focus !== undefined ? $scope.view.focus : -1;
          angular.element($scope.view.listElement).children().removeClass('focused');
          // key arrow down
          if (e.keyCode === 40) {
            if ($scope.view.focus === max) {
              $scope.view.focus = min;
            } else {
              $scope.view.focus += 1;
            }
          }
          // key arrow up
          if (e.keyCode === 38) {
            if ($scope.view.focus <= min) {
              $scope.view.focus = max;
            } else {
              $scope.view.focus -= 1;
            }
          }
          if ($scope.view.focus >= 0) {
            angular.element(angular.element($scope.view.listElement).children()[$scope.view.focus]).addClass('focused');
          }
          $scope.$apply();

          var $container = $scope.view.listElement;
          var $focus = angular.element($scope.view.listElement).children()[$scope.view.focus];
          var containerHeight = $container.offsetHeight;
          var currentOffset = $focus.offsetHeight * ($scope.view.focus + 1);

          if (currentOffset >= containerHeight) {
            $container.scrollTop = currentOffset;
          } else if (currentOffset <= $container.scrollTop) {
            $container.scrollTop = 0;
          }


        }

        this.isItemSelected = function (el) {
          return _.findWhere($scope.selectedItems, {value: angular.element(el).scope().getItemValue()});
        };

        this.toggleList = function () {
          if ($scope.isDisabled()) {
            return;
          }
          updateListControl();
          $scope.view.show = !$scope.view.show;
          if ($scope.view.show) {
            $timeout(function () {
              $document.bind('click', clickHandler);
              //angular.element($scope.view.selectElement).on('keydown', keyHandler);
            }, 0);
            if ($scope.view.isFilterEnabled) {
              $timeout(function () {
                $scope.view.searhElement.focus();
              });
            }
          } else {
            unbindEvents();
          }
        };

        this.getCurrentItemsLength = function () {
          return Object.keys(vm.itemsList).length;
        };

        function selectItem(el) {
          var elementScope = angular.element(el).scope();
          $scope.selectedItems[elementScope.getItemIndex()] = {
            label: elementScope.getItemLabel(),
            value: elementScope.getItemValue(),
            element: el
          };
        }

        this.deselectById = function (id) {
          if ($scope.isDisabled()) {
            return;
          }
          delete $scope.selectedItems[id];
          vm.updateValue();
          //deselectItem($scope.selectedItems[id].element);
        };

        function deselectItem(el) {
          if ($scope.isDisabled()) {
            return;
          }
          var elementScope = angular.element(el).scope();
          delete $scope.selectedItems[elementScope.getItemIndex()];
          if (Object.keys($scope.selectedItems).length === 0 && !$scope.view.isEmptyAllowed) {
            if ($scope.view.type === 'multi' && $scope.view.default) {
              elementScope = angular.element($scope.view.default.element).scope();
            }
            $scope.selectedItems[elementScope.getItemIndex()] = {
              label: elementScope.getItemLabel(),
              value: elementScope.getItemValue(),
              element: el
            };
          }
        }

        function updateListControl() {
          angular.element($scope.view.listElement).find('option-item').removeClass('selected');
          //var labels = [];
          angular.forEach($scope.selectedItems, function (item) {
            var e = angular.element(item.element);
            if (e.length > 0) {
              angular.element(e).addClass('selected');
              //labels.push(e.scope().getItemLabel());
            }
          });

          //$scope.label = $scope.type === 'multi' ? labels : labels[0];

        }

        this.getValue = function () {
          return _.map($scope.selectedItems, function (i) {
            var el = angular.element(i.element);
            if (el.scope && el.scope()) {
              return el.scope().getItemValue();
            } else {
              return i.value;
            }
          });
        };

        this.updateLabel = function () {
          if ($scope.view.type === 'multi') {
            return;
          }
          var keys = Object.keys($scope.selectedItems);
          $scope.label = keys.length > 0 ? $scope.selectedItems[keys[0]].label : undefined;
        };

        this.updateValue = function () {
          var value = this.getValue();
          value = $scope.view.type === 'multi' ? value : value[0];
          $scope.ngModel.$setViewValue(value);
          //$scope.ngModel.$validate();
        };

        this.onItemClicked = function (el, index) {
          if ($scope.view.type !== 'multi') {
            $scope.selectedItems = {};
            selectItem(el, index);
          } else {
            if (this.isItemSelected(el, index)) {
              deselectItem(el, index);
            } else {
              selectItem(el, index);
            }
          }
          updateListControl();


          $scope.$apply(function () {
            vm.updateValue();
            if ($scope.onValueChanged) {
              $scope.onValueChanged();
            }
            $scope.onItemSelected($scope.view.type !== 'multi' ?
              {
                index: angular.element(el).scope().getItemIndex(),
                value: angular.element(el).scope().getItemValue(),
                label: angular.element(el).scope().getItemLabel()
              } : {
                values: _.map($scope.selectedItems, function (i) {
                  return i.value;
                }),
                items: _.map($scope.selectedItems, function (item, key) {
                  return {index: key, label: item.label, value: item.value};
                })
              }
            );
          });
        };

        this.setDefault = function () {
          if ($scope.value === undefined) {
            selectItem($scope.default.element);
            updateListControl();
            vm.updateValue();
          }
        };

        this.onItemAdded = function (el, index, isDefault) {
          var elementScope = angular.element(el).scope();
          var value = elementScope.getItemValue();
         // var label = elementScope.getItemLabel();
          index = index || elementScope.getItemIndex();
          vm.itemsList[index] = el;


          if (undefined !== value && [].concat($scope.value).indexOf(value) !== -1) {
            var selectedItem = this.isItemSelected(el);
            if (selectedItem) {
              if (selectedItem.element && angular.element(selectedItem.element).parent().length !== 0) {
                selectItem(el);
              } else {
                selectedItem.element = el;
              }
            } else {
              selectItem(el);
            }
            angular.element(el).addClass('selected');
          }

          if (isDefault || (index === 0 && !$scope.view.isEmptyAllowed)) {
            if ($scope.value === undefined) {
              $scope.value = $scope.view.type === 'multi' ?
                [angular.element(el).scope().getItemValue()]
                : angular.element(el).scope().getItemValue();
            }

            $scope.view.default = {index: index, element: el};
          }
          //itemsValuesList[index] = value;
          //itemsLabelList[index] = label;
          vm.updateLabel();
          return this.getCurrentItemsLength();
        };

        this.onItemRemoved = function (el, index) {
          delete vm.itemsList[index];
          if ($scope.selectedItems[index]) {
            delete $scope.selectedItems[index].element;
          }


          if ($scope.view.default && $scope.view.default.index === index) {
            if ($scope.view.isEmptyAllowed) {
              delete $scope.view.default;
            } else {
              var key = Object.keys(vm.itemsList)[0];
              $scope.view.default = {index: key, element: vm.itemsList[key]};
            }
          }
        };


        //this.getItemComponent = function () {
        //  var itemComponent = scope.$eval(attr.itemComponent);
        //  if (itemComponent) {
        //   return itemComponent;
        //  }
        //  return false;
        //};
      }
    };
  })

  .directive('optionItem', function () {
    return {
      restrict: 'EA',
      //requires: true,
      require: '^dfSelectbox',
      scope: true,
      link: function post(scope, element, attrs, selectboxCtrl) {
        var el = angular.element(element);

        el.addClass('select-item');


        scope.onItemSelected = function (element) {
          selectboxCtrl.onItemClicked(element, scope.getItemIndex());
        };

        angular.element(element).on('click', function (event) {
          if (angular.element(element).attr('ignore')) {
            event.stopPropagation();
            return;
          }
          scope.onItemSelected(element);
        });

        scope.getItemValue = function () {
          try{
            return scope.$eval(attrs.value) || attrs.value;
          } catch (e){
            return attrs.value;
          }
        };

        scope.getItemLabel = function () {
          if (attrs.label !== undefined ){
            try {
              return scope.$eval(attrs.label) || attrs.label;
            } catch (e){
              return attrs.label;
            }
          } else {
            //return scope.getItemValue();
            return angular.element(element).html();
          }
        };
        scope.getItemIndex = function () {
          return scope.$index || scope.index || scope.$id;
        };

        scope.$on('$destroy', function () {
          selectboxCtrl.onItemRemoved(element, scope.getItemIndex());
        });

        selectboxCtrl.onItemAdded(
          element,
          scope.getItemIndex(),
          scope.$eval(attrs.default) === true
        );
      }
    };
  });
