'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('styles', function () {

    var injectFiles = gulp.src([
      options.config.styles.allStyles,
      '!' + options.config.styles.indexStyle,
      '!' +  options.config.styles.vendorStyle
    ], { read: false });

    var mainStyles= gulp.src([options.config.appstylus]);
    var mainOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.config.srcApp, '');
        return '@import \'' + filePath + '\';';
      },
      addRootSlash:false,
      name:'main'
    };
    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.config.srcApp, '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('index.styl');
    var vendorFilter = $.filter('vendor.styl');

    return gulp.src([
      options.config.styles.indexStyle,
      options.config.styles.vendorStyle,
      options.config.otherStyles,
      options.config.appstylus
    ])
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      .pipe(vendorFilter)
      .pipe(wiredep(options.wiredep))
      .pipe(vendorFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.stylus()).on('error', options.errorHandler('Stylus'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.config.tempServeAppStyles))
      .pipe(browserSync.reload({ stream: true }));
  });

};
