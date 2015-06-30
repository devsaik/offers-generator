/**
 * @ngdoc service
 * @name ImageEntity
 * @description
 * The ImageEntity
 * */
'use strict';
angular.module('AppBundle')
  .factory('ImageEntity',
  /**
   * @param {BaseEntity} BaseEntity
   * @param $q
   * @param $rootScope
   * @param {$http} $http
   * @param {AppTools} appTools
   * @return {ImageEntity}
   * @param {[Document]} $document
   * @param private__imageService
   */
  function (BaseEntity, $q, $rootScope, $http, appTools, $document, private__imageService) {
    /**
     * @ngdoc type
     * @class
     * @description
     * This is Image entity
     * @extends BaseEntity
     * @constructor
     *
     */
    function ImageEntity() {
      /**
       *
       * @type {base64}
       */
      this.base64 = undefined;
      BaseEntity.prototype.$construct.apply(this, arguments);
    }

    /**
     *
     * @type ImageEntity
     */
    ImageEntity.prototype = {
      getBase64: function () {
        return this.base64;
      },

      loadFile: function () {
        if (!this.url) {
          return $q.reject('Image url is null');
        }
        var self = this;
        var defer = $q.defer();

        $http.get(this.getSafeUrl(), {
          responseType: 'blob'
        }).then(function (response) {
          var reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = function () {
            self.base64 = reader.result;
            defer.resolve(self);
          };
        }).catch(function (e) {
          defer.reject(e);
        });

        return defer.promise;
      },

      fromFile: function (file) {
        if (!(file instanceof File)) {
          throw 'Unsupported type File expected';
        }
        var defer = $q.defer();
        var self = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          self.base64 = reader.result;
          delete self.width;
          delete self.height;
          delete self.url;
          defer.resolve(self);
        };

        angular.extend(this, file);
        this.title = this.name;
        return defer.promise;
      },
      isNew: function () {
        return this.$getId() === undefined;
      },
      fromBlob: function (blob) {
        var defer = $q.defer();
        var self = this;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          self.base64 = reader.result;
          delete self.width;
          delete self.height;
          delete self.url;
          defer.resolve(self);
        };
        return defer.promise;
      },
      toBlob: function () {
        var binary = atob(this.base64.split(',')[1]);
        var mimeString = this.base64.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: mimeString});
      },
      getImageSize: function () {
        if (this.imageSize && this.imageSize.width && this.imageSize.height) {
          return $q.resolve(this);
        }
        var defer = $q.defer();
        var img = new Image();
        var self = this;
        img.onload = function () {
          $rootScope.$apply(function () {
            self.imageSize = {
              width: img.width,
              height: img.height
            };
            defer.resolve(self);
          });
        };

        img.src = this.getUrlOrBase64();
        return defer.promise;
      },
      setImageSize: function (width, height) {

        var defer = $q.defer();
        var img = new Image();
        //var resizeWidth = parseInt(width);
        //var resizeHeight = parseInt(height);
        var self = this;
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function () {
          private__imageService.resize(img, width, height)
            .then(function (result) {
              self.base64 = result.base64;
              self.imageSize = {
                width: result.image.width,
                height: result.image.height
              };
              defer.resolve(self);
            }).catch(function (e) {
              defer.reject(e);
            });
        };
        //
        img.src = this.getUrlOrBase64();
        return defer.promise;
      },
      getSafeUrl: function () {
        return this.url ? appTools.getPPApiBaseUrl() + '/getimg?url=' + this.url : undefined;
      },
      getUrlOrBase64: function () {
        return this.getSafeUrl() || this.base64;
      }
    };

    BaseEntity.extend(ImageEntity);

    return ImageEntity;
  }
)
  .service('private__imageService', function ($http, $q, $timeout) {
    var NUM_LOBES = 3;
    // returns a function that calculates lanczos weight
    function lanczosGenerator(lobes) {
      var recLobes = 1.0 / lobes;

      return function (x) {
        if (x > lobes) {
          return 0;
        }
        x *= Math.PI;
        if (Math.abs(x) < 1e-16) {
          return 1;
        }
        var xx = x * recLobes;
        return Math.sin(x) * Math.sin(xx) / x / xx;
      };
    }
    var lanczos = lanczosGenerator(NUM_LOBES);

    // resize via lanczos-sinc convolution
    this.resize = function (img, width, height) {
      var self = {};

      self.type = 'image/png';
      self.quality = 1.0;
      self.resultD = $q.defer();

      self.canvas = document.createElement('canvas');

      self.ctx = getContext(self.canvas);
      self.ctx.imageSmoothingEnabled = true;
      self.ctx.mozImageSmoothingEnabled = true;
      self.ctx.oImageSmoothingEnabled = true;
      self.ctx.webkitImageSmoothingEnabled = true;

      if (img.naturalWidth <= width || img.naturalHeight <= height) {
        //console.log('FAST resizing image', img.naturalWidth, img.naturalHeight, '=>', width, height);

        self.canvas.width = width;
        self.canvas.height = height;
        self.ctx.drawImage(img, 0, 0, width, height);
        resolveLanczos(self);
      } else {
        //console.log('SLOW resizing image', img.naturalWidth, img.naturalHeight, '=>', width, height);

        self.canvas.width = img.naturalWidth;
        self.canvas.height = img.naturalHeight;
        self.ctx.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);

        self.img = img;
        self.src = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
        self.dest = {
          width: width,
          height: height
        };
        self.dest.data = new Array(self.dest.width * self.dest.height * 4);

        self.ratio = img.naturalWidth / width;
        self.rcpRatio = 2 / self.ratio;
        self.range2 = Math.ceil(self.ratio * NUM_LOBES / 2);
        self.cacheLanc = {};
        self.center = {};
        self.icenter = {};

        $timeout(function () {
          applyLanczosColumn(self, 0);
        });
      }

      return self.resultD.promise;
    };

    function applyLanczosColumn(self, u) {
      self.center.x = (u + 0.5) * self.ratio;
      self.icenter.x = self.center.x | 0;

      for (var v = 0; v < self.dest.height; v++) {
        self.center.y = (v + 0.5) * self.ratio;
        self.icenter.y = self.center.y | 0;

        var a, r, g, b;
        a = r = g = b = 0;

        var norm = 0;
        var idx;

        for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
          if (i < 0 || i >= self.src.width) {
            continue;
          }
          var fX = (1000 * Math.abs(i - self.center.x)) | 0;
          if (!self.cacheLanc[fX]) {
            self.cacheLanc[fX] = {};
          }

          for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
            if (j < 0 || j >= self.src.height) {
              continue;
            }

            var fY = (1000 * Math.abs(j - self.center.y)) | 0;
            if (self.cacheLanc[fX][fY] === undefined) {
              self.cacheLanc[fX][fY] = lanczos(Math.sqrt(Math.pow(fX * self.rcpRatio, 2) + Math.pow(fY * self.rcpRatio, 2)) / 1000);
            }

            var weight = self.cacheLanc[fX][fY];
            if (weight > 0) {
              idx = (j * self.src.width + i) * 4;
              norm += weight;

              r += weight * self.src.data[idx + 0];
              g += weight * self.src.data[idx + 1];
              b += weight * self.src.data[idx + 2];
              a += weight * self.src.data[idx + 3];
            }
          }
        }

        idx = (v * self.dest.width + u) * 4;
        self.dest.data[idx + 0] = r / norm;
        self.dest.data[idx + 1] = g / norm;
        self.dest.data[idx + 2] = b / norm;
        self.dest.data[idx + 3] = a / norm;
      }

      if (++u < self.dest.width) {
        if (u % 16 === 0) {
          $timeout(function () {
            applyLanczosColumn(self, u);
          });
        } else {
          applyLanczosColumn(self, u);
        }
      } else {
        $timeout(function () {
          finalizeLanczos(self);
        });
      }
    }

    function finalizeLanczos(self) {
      self.canvas.width = self.dest.width;
      self.canvas.height = self.dest.height;
      //self.ctx.drawImage(self.img, 0, 0, self.dest.width, self.dest.height)
      self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
      var idx;
      for (var i = 0; i < self.dest.width; i++) {
        for (var j = 0; j < self.dest.height; j++) {
          idx = (j * self.dest.width + i) * 4;
          self.src.data[idx + 0] = self.dest.data[idx + 0];
          self.src.data[idx + 1] = self.dest.data[idx + 1];
          self.src.data[idx + 2] = self.dest.data[idx + 2];
          self.src.data[idx + 3] = self.dest.data[idx + 3];
        }
      }
      self.ctx.putImageData(self.src, 0, 0);
      resolveLanczos(self);
    }

    function resolveLanczos(self) {
      var result = new Image();

      result.onload = function () {
        self.resultD.resolve({image: result,base64: self.canvas.toDataURL(self.type, self.quality)});
      };

      result.onerror = function (err) {
        self.resultD.reject({error: err,base64: self.canvas.toDataURL(self.type, self.quality)});
      };

      result.src = self.canvas.toDataURL(self.type, self.quality);
    }

    // resize by stepping down
    this.resizeStep = function (img, width, height, quality) {
      quality = quality || 1.0;

      var resultD = $q.defer();
      var canvas = document.createElement('canvas');
      var context = getContext(canvas);
      var type = 'image/png';

      var cW = img.naturalWidth;
      var cH = img.naturalHeight;

      var dst = new Image();
      var tmp = null;

      //resultD.resolve(img)
      //return resultD.promise

      function stepDown() {
        cW = Math.max(cW / 2, width) | 0;
        cH = Math.max(cH / 2, height) | 0;

        canvas.width = cW;
        canvas.height = cH;

        context.drawImage(tmp || img, 0, 0, cW, cH);

        dst.src = canvas.toDataURL(type, quality);

        if (cW <= width || cH <= height) {
          return resultD.resolve(dst);
        }

        if (!tmp) {
          tmp = new Image();
          tmp.onload = stepDown;
        }

        tmp.src = dst.src;
      }

      if (cW <= width || cH <= height || cW / 2 < width || cH / 2 < height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
        dst.src = canvas.toDataURL(type, quality);

        resultD.resolve(dst);
      } else {
        stepDown();
      }

      return resultD.promise;
    };

    function getContext(canvas) {
      var context = canvas.getContext('2d');

      context.imageSmoothingEnabled = true;
      context.mozImageSmoothingEnabled = true;
      context.oImageSmoothingEnabled = true;
      context.webkitImageSmoothingEnabled = true;

      return context;
    }


  });
