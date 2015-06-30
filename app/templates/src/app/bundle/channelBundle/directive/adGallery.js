/**
 * Created by nilagor on 23.03.15.
 */
'use strict';
angular.module('ChannelBundle')
  .directive('adGallery', function (ImageEntity, ppEntityManager, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selectedImage: '=',
        onImageSelected: '&'
      },
      templateUrl: 'app/bundle/channelBundle/template/directive/ad-gallery.tpl.html',
      link: function ($scope, element) {
        var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');
        $scope.carouselStyle = {
          left: 0,
          widthItem: 83
        };

        function sortImages(){
          var array = $scope.images.container;
          var length = array.length;

          array.sort(function(a, b){
            if (moment(a.createdAt).isBefore(b.createdAt, 'date')) {
              return 1;
            }
            else {
              return -1;
            }
          });

          if (length > 7) {
            $scope.images.first = array.slice(0, Math.floor(array.length / 2));
            $scope.images.second = array.slice(Math.floor(array.length / 2));
          } else {
            $scope.images.first = array;
          }
        }

        merchantRepo.getCurrentMerchantGalleryItems()
          .then(function (items) {
            $scope.images = {
              container: []
            };

            angular.forEach(items, function (img) {
              $scope.images.container.push(new ImageEntity(img));
            });

            sortImages();
          });

        /**
         * Add image to gallery after upload or from web site
         * @param {ImageEntity} image
         */
        $scope.addImage = function addImage(image) {
          if (image instanceof Object) {
            $scope.images.container.unshift(image);
            sortImages();
            $timeout(function(){
              $scope.setSelectedImage(image, 1, 0);
            }, 0);
          }
        };

        /**
         * Set active image
         * @param {ImageEntity} image
         */
        $scope.setSelectedImage = function setSelectedImage(image, index, row) {
          var ul = angular.element(element).find('ul')[row];
          var li = angular.element(ul).find('li')[index];
          if (image.getSafeUrl instanceof Function && image.getSafeUrl() !== undefined) {
            $scope.selectedImage = image.getSafeUrl();
          } else {
            $scope.selectedImage = image.url || image.base64;
          }
          $scope.onImageSelected({index: index, image: $scope.selectedImage});

          angular.element(element).find('li').removeClass('select');
          angular.element(li).addClass('select');
        };

        /**
         * Unset active image
         * @param {ImageEntity} image
         */
        $scope.$on('setOriginAdBanner', function () {
          angular.element(element).find('li').removeClass('select');
        });

        $scope.moveThumbs = function moveThumbs(offset) {
          if (offset === 0) {
            return;
          }
          $scope.carouselStyle.left += offset;
        };

        $scope.$watch('images.container', function (newVal) {
            if (newVal && newVal.length > 0) {
              if (newVal.length > 7) {
                $scope.carouselStyle.width = $scope.carouselStyle.widthItem * (Math.floor(newVal.length / 2) + 1);
              } else {
                $scope.carouselStyle.width = $scope.carouselStyle.widthItem * (newVal.length  + 1);
              }
            } else {
              $scope.carouselStyle.width = $scope.carouselStyle.widthItem;
            }
        }, true);

        $scope.$watch('carouselStyle.left', function (newVal) {
          if (newVal !== undefined && newVal > 0) {
            $scope.carouselStyle.left = 0;
          }

          if (newVal !== undefined && newVal <= - $scope.carouselStyle.width) {
            $scope.carouselStyle.left = - $scope.carouselStyle.width + $scope.carouselStyle.widthItem;
          }
        });
      }
    };
  });
