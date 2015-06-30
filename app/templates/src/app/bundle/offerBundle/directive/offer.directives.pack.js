/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';

angular.module('OfferBundle')
  .directive('discountView', function () {
    return {
      restrict: 'A',
      scope: {discount: '='},
      templateUrl: 'app/bundle/offerBundle/template/directive/discount-view.tpl.html',
      link: function () {
      }
    };

  })

  .directive('discountField', function (dfFormUtils) {
    return {
      restrict: 'E',
      require: ['^ngModel', '^?form'],
      scope: {
        value: '=ngModel',
        label: '@',
        placeholder: '@',
        disable: '='
      },
      templateUrl: 'app/bundle/offerBundle/template/directive/discount-edit.tpl.html',
      link: function (scope, element, attributes, ctrls) {
        dfFormUtils.applyValidation(ctrls[0], ctrls[1], scope);
      }
    };
  })

  .directive('offerStatus', function (ppDialog) {
    return {
      restrict: 'A',
      scope: {
        offer: '=offerStatus',
        onStatusChanged: '&',
        type: '@',
        mode: '@'
      },
      link: function (scope, element) {
        scope.type = scope.type || 'text';
        scope.mode = scope.mode || 'edit';

        angular.element(element).on('click', function () {
          var dialog = ppDialog.open({
            className: 'popup-offer-status-change',
            controller: 'OfferStatusController as offerStatusController',
            template: 'app/bundle/offerBundle/template/dialog/offer-change-status.tpl.html',
            data: {offer: scope.offer}
          });
          dialog.closePromise.then(function (dialogResult) {
            if (!dialogResult.value || dialogResult.value === '$closeButton' || dialogResult.value === '$document') {
              return;
            }
//              scope.status = value;
            scope.offer = dialogResult.value;
            scope.onStatusChanged(scope.offer);
          });
        });
      }
    };
  })

  .directive('offerPreviewPopup', function (ppDialog, ppEntityManager) {
    return {
      restrict: 'A',
      scope: {
        offer: '=offerPreviewPopup'
      },
//        template: '',
      link: function (scope, element) {
        var dialog = null;
        var currentType = 'desktop';

        function changePopupType(offer) {
          dialog = ppDialog.open({
            //className: 'popup-offer ' + currentType,
            className: 'popup-offer middle popup-offer-preview',
            template: 'app/bundle/offerBundle/template/dialog/offer-preview-popup.tpl.html',
            data: {offer: offer},
            controller: ['$scope', 'ppEntityManager', function ($scope,ppEntityManager) {
              var offerRepository = ppEntityManager.$getRepository('OfferRepository');
              $scope.classes = currentType;
              $scope.offer = $scope.ngDialogData.offer;
              $scope.loading = true;
              offerRepository.getOfferPreviewImages($scope.offer)
                .then(function(data){
                  $scope.images = data;
                  $scope.loading = false;
                });
              //$scope.changePopupClass = function (val) {
              //  if (!val) {
              //    return;
              //  }
              //  currentType = val;
              //  if (dialog) {
              //    dialog.close();
              //  }
              //  changePopupType(offer);
              //};
            }]
          });
        }

        angular.element(element).on('click', function () {
          var offerRepo = ppEntityManager.$getRepository('OfferRepository');
          offerRepo.$find(scope.offer.id)
            .then(function (offer) {
              changePopupType(offer);
            });
        });
      }
    };
  })

  .directive('popupTutorialOffer', function (ppDialog) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        angular.element(element).on('click', function () {
          ppDialog.openOfferTutorial();
        });
      }
    };
  })
  .directive('offerCardAnnouncements', function ($timeout, $interval) {
    return {
      restrict: 'E',
      require: '^offerCardAnnouncements',
      scope: {
        //id: '=',
        ready: '=',
        //message: '=',
        controller: '='
      },
      link: function (scope) {
        var announcementInterval;

        ////this is a terrible solution
        //scope.controller.tryToShowAnnouncement = function(message){
        //
        //};
        function showAnnouncement(offerId, message) {
          $interval.cancel(announcementInterval);
          var i = 0;
          message = message || scope.message;
          announcementInterval = $interval(function () {
            if (!scope.ready) {
              return;
            }
            i++;
            $interval.cancel(announcementInterval);

            var c = scope.offerAnnouncementList[offerId];
            if (c) {
              c.show(message);
              $timeout(function () {
                $interval.cancel(announcementInterval);
                scope.id = undefined;
                c.hide();
              }, 8000);
            }
          }, 2000);
        }

        scope.controller.showAnnouncement = showAnnouncement;

        //scope.$watch('id', function (val) {
        //  if (!val) {
        //    return;
        //  }
        //  showAnnouncement(val);
        //});
      },
      controller: function ($scope) {
        $scope.offerAnnouncementList = {};
        this.add = function (id, show, hide) {
          $scope.offerAnnouncementList[id] = {show: show, hide: hide};
        };
        this.remove = function (id) {
          delete $scope.offerAnnouncementList[id];
        };
      }
    };
  });
