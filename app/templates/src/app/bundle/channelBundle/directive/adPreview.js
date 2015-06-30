/**
 * Created by Nikita Lavrenko on 30.01.2015.
 */
'use strict';
angular.module('ChannelBundle')
  .directive('adPreview', function (appConfig, $timeout) {
    return {
      restrict: 'E',
      scope: {
        settings: '=',
        channelType: '@?',
        adBannerImage: '=',
        adBannerType: '=',
        adTitle: '=?',
        adDesc: '=?',
        save: '&onSave',
        cancel: '&onCancel',
        onPlusClicked: '&',
        isNotValid: '='
      },
      templateUrl: 'app/bundle/channelBundle/template/directive/ad-preview.tpl.html',
      link: function ($scope, element) {
        $scope.moveSlider = $scope.moveImage = $scope.autoMove = false;
        $scope.channelType = $scope.channelType || 'display';
        $scope.scaleFactor = $scope.options ? $scope.options.scale : 1; //ratio of the phone picture with reality
        $scope.options = appConfig.channelBundle.channels[$scope.channelType].form.preview.options[$scope.adBannerType] || {unsupported: true};

        //console.log('adPreview created');
        //$scope.$on('$destroy', function(){
        //  console.log('adPreview destroyed');
        //});

        var startX, startY, startPosition;
        var bannerPreviewWidth, bannerPreviewHeight, previewOrigSize;
        // JS objects of main element's
        var canvas = document.getElementById('preview-mask'); // mask
        var sliderWrap = element[0].querySelector('#slider-wrap');
        var sliderPoint = element[0].querySelector('#slider-point');
        var previewImage = element[0].querySelector('#preview-img');
        //var originImage = undefined;

        var ctx = canvas.getContext('2d');

        /**
         * Draw mask (black background with title, description and empty space where mast be banner)
         */
        function drawMask() {
          bannerPreviewWidth = $scope.options.width * $scope.scaleFactor;
          bannerPreviewHeight = $scope.options.height * $scope.scaleFactor;
          var previewCenter = {
            left: $scope.options.left + bannerPreviewWidth / 2,
            top: $scope.options.top + bannerPreviewHeight / 2
          };
          // clear canvas
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // draw black background
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(0, 0, canvas.width, 700);

          // draw mask (empty space in background)
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = '#FFF';
          ctx.fillRect($scope.options.left, $scope.options.top, bannerPreviewWidth, bannerPreviewHeight);
          ctx.globalCompositeOperation = 'source-over';

          ctx.fillStyle = '#FFF';
          ctx.font = '300 23px Lato';
          ctx.textAlign = 'center';
          ctx.fillText('Crop ', previewCenter.left, 70);
          //-------------------
          ctx.fillStyle = '#FFF';
          ctx.font = '14px Lato';
          ctx.textAlign = 'center';
          if ($scope.channelType === 'display') {
            ctx.fillText('Ad Size: ' + $scope.adBannerType + ' px', previewCenter.left, 90);
          } else {
            ctx.fillText('Ad Type: ' + $scope.options.label, previewCenter.left, 90);
          }
          //-------------------
          ctx.fillStyle = '#FFF';
          ctx.font = '14px Lato';
          ctx.textAlign = 'center';
          ctx.fillText('Crop Photo: Drag to Reposition', previewCenter.left, $scope.options.top + bannerPreviewHeight + 15);
        }

        //function testImagePosition() {
        //  var narrower = previewImage.width <= bannerPreviewWidth;
        //  var shorter = previewImage.height <= bannerPreviewHeight;
        //  var badLeftSide = $scope.imagePosition.left > $scope.options.left;
        //  var badTopSide = $scope.imagePosition.top > $scope.options.top;
        //  var badRightSide = $scope.imagePosition.left + previewImage.width < $scope.options.left + bannerPreviewWidth;
        //  var badBottomSide = $scope.imagePosition.top + previewImage.height < $scope.options.top + bannerPreviewHeight;
        //
        //  if (narrower || badLeftSide) {
        //    $scope.imagePosition.left = $scope.options.left; //can't go beyond the left border
        //  } else if (!narrower && badRightSide) {
        //    $scope.imagePosition.left = $scope.options.left + bannerPreviewWidth - previewImage.width; //can't go beyond the right border
        //  }
        //  if (shorter || badTopSide) {
        //    $scope.imagePosition.top = $scope.options.top; //can't go beyond the top border
        //  } else if (!shorter && badBottomSide) {
        //    $scope.imagePosition.top = $scope.options.top + bannerPreviewHeight - previewImage.height; //can't go beyond the bottom border
        //  }
        //}

        /**
         * Start drag event
         * @param {string} target name of draging element (slider or image)
         * @param {Event} event JS event object (we need coordinates)
         */
        $scope.mouseDown = function (target, event) {
          if (!$scope.settings.enabled || !$scope.canEnabled) {
            return;
          }
          $scope.moveSlider = target === 'slider';
          $scope.moveImage = !$scope.moveSlider;
          startX = event.clientX;
          startY = event.clientY;
          if (target === 'image') {
            startPosition = {
              left: previewImage.offsetLeft,
              top: previewImage.offsetTop
            };
          } else {
            startPosition = {
              left: sliderPoint.offsetLeft
            };
          }
        };
        /**
         * Drag event
         * @param {Event} event
         */
        $scope.mouseMove = function (event) {
          if (!$scope.settings.enabled || !$scope.canEnabled) {
            return;
          }
          if ($scope.moveSlider) {
            $scope.autoMove = false;
            sliderMoving(event.clientX);
          } else if ($scope.moveImage) {
            $scope.autoMove = false;
            previewMoving(event.clientX, event.clientY);
          }
        };

        /**
         * @param {int} clientX
         * @param {int} clientY
         */
        function previewMoving(clientX, clientY) {
          $scope.imagePosition = {
            left: startPosition.left + (clientX - startX),
            top: startPosition.top + (clientY - startY)
          };
          //testImagePosition();
        }

        /**
         * @param {int} clientX
         */
        function sliderMoving(clientX) {
          // the percentage of the new position and width of the slider
          var newScale = (startPosition.left + (clientX - startX)) / sliderWrap.clientWidth * 100;
          newScale = newScale > 100 ? 100 : newScale;
          newScale = newScale < 0 ? 0 : newScale;
          $scope.scale = newScale;
        }

        $scope.sliderClick = function (event) {
          if (!$scope.settings.enabled || !$scope.canEnabled) {
            return;
          }
          $scope.autoMove = true;
          if (event.target.id === 'slider-point') {
            return; //click to slider point. No need to do anything
          }
          $scope.scale = (event.offsetX - 10) / sliderWrap.clientWidth * 100;
        };

        $scope.$watch('adBannerImage', function (val) {
          if (!val) {
            //$scope.settings.enabled = $scope.canEnabled = false;
            return;
          }
          //originImage = angular.copy(val);

          previewImage = previewImage ? previewImage : element[0].querySelector('#preview-img');
          previewImage.onload = function previewImageOnLoad() {
            previewImage.removeAttribute('width'); // reset value of width after manipulations with previous image
            previewOrigSize = {
              width: previewImage.width, // before we start manipulations it's original size's
              height: previewImage.height
            };

            if ($scope.settings.enabled) {
              $scope.scale = 50;
            } else {
              $scope.scale = 100;
            }

            $timeout(function () {
              previewImage.width = previewOrigSize.width * $scope.scaleFactor * ($scope.scale / 100);
            }, 0);
          };
          previewImage.crossOrigin = 'anonymous';
          previewImage.src = val;
          if ($scope.options && !$scope.options.unsupported) {
            $scope.imagePosition = $scope.imagePosition || {};
            $scope.imagePosition.left = $scope.options.left;
            $scope.imagePosition.top = $scope.options.top;
          }
        });
        $scope.$watch('adBannerType', function (val, oldVal) {
          if (val === undefined) {
            $scope.canEnabled = false;
            return;
          }
          //if (originImage !== null && originImage !== $scope.adBannerImage){
          //  $scope.adBannerImage = angular.copy(originImage);
          //}
          $scope.canEnabled = true;
          $scope.autoMove = oldVal !== undefined;
          $scope.options = appConfig.channelBundle.channels[$scope.channelType || 'display' ].form.preview.options[val] || {unsupported: true};
          $scope.scaleFactor = $scope.options.scale;


          if ($scope.options.background !== undefined) {
            $scope.imgBoxStyle = {
              background: 'url(' + $scope.options.background + ') 0 0 no-repeat'
            };
          }
          $scope.imagePosition = {
            left: $scope.options.left,
            top: $scope.options.top
          };

          if ($scope.settings.enabled && $scope.canEnabled) {
            drawMask();
          }
        });

        $scope.$watch('scale + scaleFactor', function () {
          if (!previewImage || !$scope.settings.enabled || !$scope.canEnabled) {
            return;
          }
          if ($scope.scale > 100) {
            $scope.scale = 100;
          } else if ($scope.scale < 0) {
            $scope.scale = 0;
          }
          previewImage.width = previewOrigSize.width * $scope.scaleFactor * ($scope.scale / 100);
          //if ($scope.autoMove) {
          //  $timeout(testImagePosition, 300);
          //} else {
          //  testImagePosition();
          //}
        });
        $scope.$watch('adTitle + adDesc', function () {
          if ($scope.settings.enabled && $scope.canEnabled && $scope.channelType === 'display') {
            drawMask();
          }
        });
        $scope.$watch('settings', function (val) {
          if (val && val.enabled && $scope.canEnabled) {
            drawMask();
            $scope.isNotValid = false;
          }
        }, true);

        $scope.reset = function () {
          //$scope.adBannerImage = originImage;
          $scope.autoMove = true;
          if ($scope.settings.enabled) {
            $scope.scale = 50;
          } else {
            $scope.scale = 100;
          }

          $scope.imagePosition.left = $scope.options.left;
          $scope.imagePosition.top = $scope.options.top;
          $scope.cancel();
          $timeout(function () {
            $scope.settings.enabled = false;
          }, 0);
        };


        $scope.settings.doSaveImage = $scope.crop = function () {
          var resultCanvas = document.createElement('canvas');
          resultCanvas.width = $scope.options.width;
          resultCanvas.height = $scope.options.height;
          resultCanvas.background = 'rgba(255, 255, 255, 0)';
          var resultCtx = resultCanvas.getContext('2d');

          if ($scope.imagePosition === undefined){
            $scope.imagePosition = {
              left: $scope.options.left,
              top: $scope.options.top
            };
          }

          var resultLeft = ($scope.imagePosition.left - $scope.options.left) / $scope.scaleFactor;
          var resultTop = ($scope.imagePosition.top - $scope.options.top) / $scope.scaleFactor;
          var resultWidth = previewImage.width / $scope.scaleFactor;
          var resultHeight = previewImage.height / $scope.scaleFactor;

          resultCtx.drawImage(previewImage, resultLeft, resultTop, resultWidth, resultHeight);
          function drawAllText() {
            // draw Place
            resultCtx.fillStyle = 'rgba(255,255,255,0.8)';
            resultCtx.fillRect(0, $scope.options.height / 2 - 18, $scope.options.width, 36);

            // draw Title
            resultCtx.imageSmoothingEnabled = false;
            resultCtx.fillStyle = '#000';
            resultCtx.font = 'bold 15px/18px Lato';
            resultCtx.textAlign = 'center';
            resultCtx.fillText($scope.adTitle, $scope.options.width / 2, $scope.options.height / 2 - 2);

            // draw Desc
            resultCtx.imageSmoothingEnabled = false;
            resultCtx.fillStyle = '#000';
            resultCtx.font = '14px/18px Lato';
            resultCtx.textAlign = 'center';
            resultCtx.fillText($scope.adDesc, $scope.options.width / 2, $scope.options.height / 2 + 14);
          }

          function drawTitle() {
            // draw Place
            resultCtx.fillStyle = 'rgba(255,255,255,0.8)';
            resultCtx.fillRect(0, $scope.options.height / 2 - 9, $scope.options.width, 18);

            // draw Title
            resultCtx.fillStyle = '#000';
            resultCtx.font = 'bold 15px/18px Lato';
            resultCtx.textAlign = 'center';
            resultCtx.fillText($scope.adTitle, $scope.options.width / 2, $scope.options.height / 2 + 5);
          }

          function drawDescr() {
            // draw Place
            resultCtx.fillStyle = 'rgba(255,255,255,0.8)';
            resultCtx.fillRect(0, $scope.options.height / 2 - 9, $scope.options.width, 18);

            // draw Desc
            resultCtx.fillStyle = '#000';
            resultCtx.font = '14px/18px Lato';
            resultCtx.textAlign = 'center';
            resultCtx.fillText($scope.adDesc, $scope.options.width / 2, $scope.options.height / 2 + 5);
          }
          if ($scope.adTitle && $scope.adDesc) {
            drawAllText();
          }
          else if ($scope.adTitle) {
            drawTitle();
          }
          else if ($scope.adDesc) {
            drawDescr();
          }

          $scope.adBannerImage = resultCanvas.toDataURL('png');
          $timeout(function () {
            $scope.settings.enabled = false;
          }, 0);
          $scope.save({image: resultCanvas.toDataURL('png')});


        };
      }
    };
  });
