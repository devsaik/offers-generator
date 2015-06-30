/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
/**
 * @module AppBundle
 * @description A gallery directives pack
 */
angular.module('AppBundle')
/**
 *
 */
  .directive('adCarousel', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        images: '=',
        options: '=',
        selectedImage: '='
      },
      templateUrl: 'app/bundle/channelBundle/template/directive/ad-carousel.tpl.html',
      link: function ($scope, element) {
        $scope.$watch('images', function (newVal) {
          if (newVal && newVal.length > 0) {
            $scope.options.carousel.width = $scope.options.item.width * newVal.length;
          }
        }, true);

        $scope.move = function (offset, move) {
          if (offset === 0) {
            return;
          }

          if (move.left) {
            $scope.options.carousel.left += offset;
          } else {
            $scope.options.carousel.left -= offset;
          }

          slide($scope.options.carousel.left);
        };

        /**
         * deselect image with external effect
         */
        $scope.$on('deselectCarousel', function(){
          angular.element(element).find('li').removeClass('select');
        });

        /**
         * select image
         * @param {ImageEntity} image
         */
        $scope.setSelectedImage = function setSelectedImage(image, index, row) {
          var ul = angular.element(element).find('ul')[row];
          var li = angular.element(ul).find('li')[index];
          angular.element(element).find('li').removeClass('select');
          angular.element(li).addClass('select');
          $scope.selectedImage = image;
          $scope.$emit('selectCarousel');
        };

        /**
         * Reposition slide items
         * @param position
         */
        function slide (position) {
          if (position !== undefined && position > 0) {
            $scope.options.carousel.left = 0;
          }

          if (position !== undefined && position <= - $scope.options.carousel.width) {
            $scope.options.carousel.left = - $scope.options.carousel.width + $scope.options.item.width;
          }
        }
      }
    };
  })
/**
 * @ngdoc directive
 * @name gallery popup
 * @restrict A
 * @description a gallery popup directive. when user click`s on the element popup will be shown
 */
  .directive('galleryPopup',
  /**
   * @param {PPDialog} ppDialog
   */
  function (ppDialog) {
    return {
      restrict: 'A',
      scope: {
        onImageChosen: '&',
        options: '='
      },
      link: function ($scope, element) {
        function openDialog() {
          $scope.controls.dialog = ppDialog.open({
            template: 'app/bundle/appBundle/template/dialogs/gallery.tpl.html',
            controller: 'GalleryController as vm',
            className: 'popup-channel middle',
            scope: $scope
          });
          $scope.controls.dialog.closePromise.then(function (result) {
            if (result.value) {
              $scope.onImageChosen({image: result.value});
            }
          });
        }

        $scope.controls = {};
        $scope.$on('galleryPopup:doOpen', openDialog);
        angular.element(element).on('click', openDialog);

      }
    };
  })

  .directive(
  'galleryPreview',
  /**
   *
   * @param {PPEntityManager} ppEntityManager
   * @param {ImageEntity} ImageEntity
   */
  function (ppEntityManager, ImageEntity) {
    return {
      restrict: 'A',
      scope: {
        images: '=?',
        count: '=?',
        onItemSelected: '&'
      },
      //transclude: true,
      templateUrl: 'app/bundle/appBundle/template/directive/gallery-preview.tpl.html',
      controllerAs: 'vm',
      link: function () {

      },
      controller: function ($scope) {
        ppEntityManager.$getRepository('MerchantRepository').getCurrentMerchantGalleryItems()
          .then(function (items) {
            $scope.images = items.splice(0, $scope.count || 3);
          });

        this.onItemSelected = function (image) {
          $scope.onItemSelected({item: image instanceof ImageEntity ? image : new ImageEntity(image)});
        };
      }
    };
  });
