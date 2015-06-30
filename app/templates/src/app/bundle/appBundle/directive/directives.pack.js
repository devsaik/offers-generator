/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
/**
 * @module AppBundle
 * @description A pack of common directives
 */
angular.module('AppBundle')
/**
 * @ngdoc directive
 * @name loadingContainer
 * @restrict A
 * @description When TRUE then disable element by adding overlay over it.
 */
  .directive('loadingContainer', function () {
    return {
      restrict: 'A',
      scope: {
        isLoading: '=loadingContainer'
      },
      link: function (scope, element) {
        var loadingLayer = angular.element('<div class="loading"></div>');
        element.append(loadingLayer);
        element.addClass('loading-container');
        loadingLayer.toggleClass('ng-hide', true);
        scope.$watch('isLoading', function (value) {
          if (value === undefined) {
            return;
          }
          loadingLayer.toggleClass('ng-hide', !scope.$eval(value));
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name ppSrc
 * @restrict A
 * @description Added full path to asset based on current app file server
 */
  .directive('ppSrc', function (appTools) {
    return {
      priority: 1001, // compiles first
      scope: {
        ppSrc: '@',
        dynamicSrc: '=?'
      },
      terminal: true, // prevent lower priority directives to compile after it
      link: function (scope, element) {
        var baseUrl = appTools.getPPPortableClientCfg().appRootUrl || '';
        //element.removeAttr('pp-src');
        if (scope.dynamicSrc){
          scope.$watch('dynamicSrc', function(val){
            element.attr('src', baseUrl + val);
          });
        } else {
          element.attr('src', baseUrl + scope.ppSrc);
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name slidePanels
 * @restrict E
 * @description Show only one of the panels which contains inside itself
 */
  .directive('slidePanels', function () {
    return {
      restrict: 'EA',
      transclude: true,
      replace: false,
      scope: {
        headline: '=?'
      },
      template: '<div ng-transclude></div>',
      controller: function ($scope) {
        // This array keeps track of the accordion panels
        this.panels = [];

        // Ensure that all the panels in this accordion are closed, unless close-others explicitly says not to
        this.closeOthers = function (openPanel) {
//          var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : panelsConfig.closeOthers;
//          if ( closeOthers ) {
          angular.forEach(this.panels, function (panel) {
            panel.isOpen = panel === openPanel;
          });
          $scope.headline = openPanel.headline;
//          }
        };

        // This is called from the accordion-panel directive to add itself to the accordion
        this.addPanel = function (panelscope) {
          var that = this;
          this.panels.push(panelscope);

          panelscope.$on('$destroy', function () {
            that.removePanel(panelscope);
          });
        };

        // This is called from the accordion-panel directive when to remove itself
        this.removePanel = function (panel) {
          var index = this.panels.indexOf(panel);
          if (index !== -1) {
            this.panels.splice(this.panels.indexOf(panel), 1);
          }
        };
      }
    };
  })

/**
 * @ngdoc directive
 * @name panel
 * @restrict E
 * @description Show only one of the panels which contains inside itself
 */
  .directive('panel', [
    '$parse', function ($parse) {
      return {
        require: '^slidePanels',         // We need this directive to be inside an accordion
        restrict: 'EA',
        transclude: true,              // It transcludes the contents of the directive into the template
        replace: false,                // The element containing the directive will be replaced with the template
        template: '<div ng-class="{active: isOpen, inactive: !isOpen}" ng-transclude></div>',
        scope: {heading: '@'},        // Create an isolated scope and interpolate the heading attribute onto this scope
        link: function (scope, element, attrs, slidePanelsCtrl) {
          var getIsOpen, setIsOpen;
          scope.headline = attrs.headline;
          slidePanelsCtrl.addPanel(scope);

          scope.isOpen = false;

          if (attrs.isOpen) {
            getIsOpen = $parse(attrs.isOpen);
            setIsOpen = getIsOpen.assign;

            scope.$parent.$watch(getIsOpen, function (value) {
              scope.isOpen = !!value;
            });
          }

          attrs.$observe('isOpen', function (value) {
            if (!value) {
              return;
            }
            value = JSON.parse(value);
            if (value) {
              slidePanelsCtrl.closeOthers(scope);
            }
            if (setIsOpen) {
              setIsOpen(scope.$parent, value);
            }
          });
        }
      };
    }
  ])


/**
 * @ngdoc directive
 * @name disabledppMessage
 * @restrict CE
 * @description Parse message which we get from the server and convert it to string if it possible
 */
  .directive('disabledppMessage', function ($interpolate) {
    return {
      restrict: 'CE',
//      require: '^formFor',
      templateUrl: 'app/bundle/appBundle/template/directive/pp-message.tpl.html',
      scope: {message: '='},
      link: function (scope) {
        function parseText(text) {
          var template = $interpolate('<li>{{text}}</li>');
          if (text.errors && text.errors.length > 0) {
            var msgs = '';
            for (var i = 0; i < text.errors.length; i++) {
              var t = text.errors[i].toString ? text.errors[i].toString() : text.errors[i];
              msgs = msgs + template({text: t});
            }
            return {is_simple: false, text: msgs};
          } else {
            return {is_simple: true, text: text};
          }
        }

        if (scope.message) {
          scope._message = parseText(scope.message);
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name uiScroll
 * @restrict A
 * @description jQuery slimScroll wrapper
 */
  .directive('uiScroll', function () {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attr) {
        //angular.element(element).slimScroll();
        var off = [];
        var option = {
          height: 100 + '%',
          distance: 4,
          alwaysVisible: false
        };

        var refresh = function () {
          if ($attr.slimscroll) {
            option = $scope.$eval($attr.slimscroll);
          } else if ($attr.uiScroll) {
            option = $scope.$eval($attr.uiScroll);
          }
          $($elem).slimScroll({destroy: true});
          $($elem).slimScroll(option);
        };

        var init = function () {
          refresh();

          if ($attr.slimscroll && !option.noWatch) {
            off.push($scope.$watchCollection($attr.slimscroll, refresh));
          }

          if ($attr.slimscrollWatch) {
            off.push($scope.$watchCollection($attr.slimscrollWatch, refresh));
          }

          if ($attr.slimscrolllistento) {
            off.push($scope.$on($attr.slimscrolllistento, refresh));
          }
        };

        var destructor = function () {
          off.forEach(function (unbind) {
            unbind();
          });
          $($elem).slimScroll({destroy: true});
          off = null;
        };

        off.push($scope.$on('$destroy', destructor));
        init();
      }
    };
  })

  .directive('rotateSlider', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        $timeout(function(){
          angular.element(element).flipster({
            style:              'coverflow',
            start:              'center',
            enableKeyboard:     true,
            enableMousewheel:   true,
            enableTouch:        true,
            enableNav:          false,
            enableNavButtons:   false,
          });
        }, 3000);
      }
    };
  })

/**
 * @ngdoc directive
 * @name ngThumb
 * @restrict A
 * @description if HTML5 is enabled try to load image and load it thumb into the canvas
 * @param {object}   ngThumb         Set of config properties
 * @param {File}      ngThumb.file    File to render. Should be an image
 * @param {string}    ngThumb.width   The thump width
 * @param {string}    ngThumb.height  The thumb height
 * */
  .directive('ngThumb', ['$window', function ($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function (item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function (file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      scope: {
        params: '=ngThumb'
      },
      link: function (scope, element) {
        if (!helper.support) {
          return;
        }

        var canvas = element.find('canvas');
//

        function redraw() {
          var reader = new FileReader();
          reader.onload = onLoadFile;
          reader.readAsDataURL(scope.params.file);


        }

        //var params = scope.$eval(attributes.ngThumb);

        if (!helper.isFile(scope.params.file)) {
          return;
        }
        if (!helper.isImage(scope.params.file)) {
          return;
        }

        scope.$watch('params', function (val) {
          redraw(val);
        });


        function onLoadFile(event) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = event.target.result;
        }

        function onLoadImage() {
          var width = scope.params.width || this.width / this.height * scope.params.height;
          var height = scope.params.height || this.height / this.width * scope.params.width;
          canvas.attr({width: width, height: height});
          var context = canvas[0].getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(this, 0, 0, width, height);
        }
      }
    };
  }])

/**
 * @ngdoc directive
 * @name httpPrefix
 * @restrict A
 * @description add http:// to any input
 * */
  .directive('httpPrefix', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, controller) {
        function ensureHttpPrefix(value) {
          // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
          if (value && !/^(http):\/\//i.test(value) && 'http://'.indexOf(value) === -1) {
            controller.$setViewValue('http://' + value);
            controller.$render();
            return 'http://' + value;
          }
          else {
            return value;
          }
        }

        controller.$formatters.push(ensureHttpPrefix);
        controller.$parsers.push(ensureHttpPrefix);
      }
    };
  })
/**
 * @todo rewrite and remove it
 */
  .directive('selectboxDinamic', function ($injector) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/bundle/appBundle/template/directive/form/selectbox-dinamic.tpl.html',
      scope: {
        model: '=ngModel'
      },
      link: function (scope, element, attrs) {
        var service = $injector.get(attrs.service);
        var method = attrs.method;
        scope.type = attrs.type || 'multi';
        scope.search = function (criteria) {
          if (criteria) {
            scope.charLength = 3 - criteria.length;
          }
          if (criteria === '') {
            scope.charLength = 3;
          }

          if (criteria && criteria.length > 2) {
            service[method](criteria)
              .then(function (items) {
                scope.items = items;
              }).catch(function () {
                scope.items = [];
              });
          }
        };

      }
    };
  })
/**
 * @ngdoc directive
 * @name distribution-list-editor
 * @restrict E
 * @description image cropper
 */
  .directive('distributionListEditor',
  /**
   *
   * @param {PPEntityManager} ppEntityManager
   */
  function (ppEntityManager, notify) {
    return {
      restrict: 'E',
      scope: {
        listId: '=',
        type: '=',
        onSaved: '&'
      },
      link: function () {

      },
      templateUrl: 'app/bundle/appBundle/template/directive/distribution-list-editor.tpl.html',
      controllerAs: 'vm',
      controller: function ($scope) {

        /**
         *
         * @type {MerchantRepository}
         */
        var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');


        $scope.newRecepient = {
          distributionListId: $scope.listId
        };

        $scope.$watch('listId', function (val) {
          $scope.isLoading = true;

          if (!val || val === '') {
            return;
          }

          merchantRepo.getCurrentMerchantDistributonChannelRecepients($scope.listId)
            .then(function (recepients) {
              $scope.isLoading = false;
              $scope.recepients = recepients;
            });
        });


        this.saveRecepient = function (recepient) {
          $scope.isLoading = true;
          merchantRepo.saveCurrentMerchantDistributonChannelRecepient(recepient)
            .then(function (recepient) {
              //notify.success('Recepient Saved');
              var oldRecepient = _.find($scope.recepients, {id: recepient.id});
              $scope.recepients = _.reject($scope.recepients, {id: recepient.id});
              $scope.recepients.push(recepient);
              if (!oldRecepient) {
                $scope.newRecepient = {
                  distributionListId: $scope.listId
                };
                $scope.isLoading = false;
              }
            }).catch(function (e) {
              $scope.isLoading = false;
              notify.error('Unabele to save recepient', e);
            });
        };

        this.removeRecepient = function (recepient) {
          merchantRepo.deleteCurrentMerchantDistributonChannelRecepient(recepient)
            .then(function () {
              //notify.success('Recepient Deleted');
              $scope.recepients = _.reject($scope.recepients, {id: recepient.id});
            }).catch(function (e) {
              notify.error('Unabele to remove recepient', e);
            });
        };
      }
    };
  })

  .directive('distributionListManage',
  function (ppEntityManager, notify) {
    return {
      restrict: 'E',
      scope: {
        type: '=',
        listId: '=',
        channels: '='
      },
      templateUrl: 'app/bundle/appBundle/template/directive/distribution-list-manage.tpl.html',
      controllerAs: 'vm',
      controller: function ($scope) {
        var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');
        //$scope.channels = [];
        $scope.controls = {
          channelType: $scope.type.toUpperCase()
        };

        $scope.$watch('controls.editedChannel', function (val) {
          if (!val) {
            return;
          }
          $scope.listId = val.id;
        });

        //merchantRepo.getCurrentMerchantDistributionList($scope.controls.channelType)
        //  .then(function (list) {
        //    $scope.channels = list;
        //  });

        $scope.setEdited = function () {
          $scope.controls.channelName_edit = $scope.controls.editedChannel.name;
          $scope.controls.editedEvent = true;
          $scope.controls.channelType = $scope.controls.editedChannel.channel;
        };

        $scope.cancelEdited = function () {
          $scope.controls.editedEvent = false;
          $scope.listId = '';
          delete $scope.controls.editedChannel;
        };

        this.addNewDistributionChannelList = function (name, type) {
          merchantRepo.saveCurrentMerchantDistributonChannelList({name: name, channel: type})
            .then(function (item) {
              $scope.channels.push(item);
              //notify.success('Success', 'Free Distribution Channel List Added');
              $scope.controls.channelName = '';
            }).catch(function (e) {
              notify.error('Error', e);
            });
        };

        this.editDistributionChannelList = function (name, obj) {
          merchantRepo.saveCurrentMerchantDistributonChannelList({name: name, channel: obj.channel, id: obj.id})
            .then(function (item) {
              $scope.channels = _.filter($scope.channels, function (num) {
                return !_.isEqual(obj, num);
              });
              $scope.channels.push(item);
              //notify.success('Success', 'Free Distribution Channel List Changed');
              $scope.controls.channelName_edit = '';
              $scope.cancelEdited();
            }).catch(function (e) {
              notify.error('Error', e);
            });
        };

        this.deleteDistributionChannelList = function (obj) {
          merchantRepo.deleteCurrentMerchantDistributonChannelList({id: obj.id})
            .then(function () {
              $scope.channels = _.filter($scope.channels, function (num) {
                return !_.isEqual(obj, num);
              });
              //notify.success('Success', 'Free Distribution Channel List Removed');
            }).catch(function (e) {
              notify.error('Error', e);
            });
        };

      }
    };
  })

  .directive('infiniteScroll', ['$timeout', function (timeout) {
    return {
      link: function (scope, element, attr) {
        var
          lengthThreshold = attr.scrollThreshold || 50,
          timeThreshold = attr.timeThreshold || 400,
          handler = scope.$eval(attr.infiniteScroll),
          promise = null,
          lastRemaining = 9999;

        lengthThreshold = parseInt(lengthThreshold, 10);
        timeThreshold = parseInt(timeThreshold, 10);

        if (!handler || !angular.isFunction(handler)) {
          handler = angular.noop;
        }

        element.bind('scroll', function () {
          var
            remaining = element[0].scrollHeight - (element[0].clientHeight + element[0].scrollTop);

          //if we have reached the threshold and we scroll down
          if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

            //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
            if (promise !== null) {
              timeout.cancel(promise);
            }
            promise = timeout(function () {
              handler();
              promise = null;
            }, timeThreshold);
          }
          lastRemaining = remaining;
        });
      }

    };
  }])

.directive('ppLoadingBar', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        resolve: '='
      },
      template: '<div class="pp-loading-bar" ng-hide="resolve" ng-anim><div class="loading-bar-spinner"><div class="spinner-icon"></div></div></div>'
    };
  })

  .directive('showPopup', function (ppDialog) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        angular.element(element).on(attrs.popupEvent || 'click', function () {
          var classNames = attrs.popupClass || 'middle';
          var template = attrs.showPopup;
          var controller = attrs.popupController;
          ppDialog.open({
            className: 'pp-popup ' + classNames,
            template: template,
            controller: controller
          });
        });
      }
    };
  });
