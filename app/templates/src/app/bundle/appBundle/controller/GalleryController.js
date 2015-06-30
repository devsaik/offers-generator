'use strict';
angular.module('AppBundle')
  .controller('GalleryController',
  /**
   *
   * @param $scope
   * @param {AdFileUploader} AdFileUploader
   * @param {ImageEntity} ImageEntity
   * @param {Embedly} embedly
   * @param $q
   * @param notify
   * @param {PPEntityManager} ppEntityManager
   */
  function ($scope, AdFileUploader, ImageEntity, embedly, $q, notify, ppEntityManager) {
    var self = this;
    /**
     *
     * @type {MerchantRepository}
     */
    var merchatRepository = ppEntityManager.$getRepository('MerchantRepository');
    $scope.uploader = new AdFileUploader();
    $scope.options = {};
    $scope.controls = {
      importedImages: []
    };

    if ($scope.ngDialogData && $scope.ngDialogData.options) {
      $scope.options = $scope.ngDialogData.options;
    }

    this.getImagesFromUrl = function (url) {
      embedly.getImages(url)
        .then(function (imgs) {
          $scope.controls.importedImages = imgs;
        });
    };

    // need to fix
    /**
     *
     * @param image
     */
    this.useThisImage = function (image) {
      function addToGallery(uploadedImage) {
        merchatRepository.addUploadedImageToGallery(uploadedImage)
          .then(function (galleryItem) {
            $scope.closeThisDialog(new ImageEntity(galleryItem));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      function uploadImageForAd() {
        var uploader = new AdFileUploader();
        var defer = $q.defer();
        //delete $scope.ad.bannerImageId;
        uploader.clearQueue();
        uploader.addToQueue(image.toBlob());

        uploader.onSuccessItem = function (fileItem, response) {
          //$scope.ad.url = response.url;
          //$scope.ad.bannerImageId = response.id;
          $scope.isNotValid = false;
          //notify.success('Success', 'Image was successfully uploaded');
          defer.resolve({fileItem: fileItem, image: response});
        };
        uploader.uploadAll();

        return defer.promise;
      }
      if (image.base64) {
        uploadImageForAd().then(function(result) {
          //addUploadedImageToGallery
          var uploadedImage = new ImageEntity(result.image);
          addToGallery(uploadedImage);
        });
      } else {
        addToGallery(image);
      }

    };

    /**
     * deselect file Image
     */
    $scope.$on('selectCarousel', function(){
      $scope.fileImageSelect = false;
    });

    /**
     * select file image
     * @param image
     */
    this.selectFileImage = function(image){
      if (image) {
        $scope.controls.imageSelected = image;
        $scope.fileImage = image;
      } else {
        $scope.controls.imageSelected = angular.copy($scope.fileImage);
      }
      $scope.fileImageSelect = true;
      $scope.$broadcast('deselectCarousel');
    };

    $scope.uploader.onAfterAddingFile = function (fileItem) {
      var input = document.getElementById('adFileUploadInput');
      if ($scope.uploader.queue.length > 1) {
        $scope.uploader.queue.shift();
      }
      if (fileItem._file instanceof File) {
        var image = new ImageEntity();
        image.fromFile(fileItem._file).then(function (image) {
          input.value = '';
          self.selectFileImage(image);
        });
      }
    };
  });
