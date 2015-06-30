'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  var injectOptions = {
    ignorePath: [options.config.srcDir, options.config.tempServe],
    addRootSlash: false
  };
  var injectAssetOptions = {
    ignorePath: [options.config.srcDir, options.config.tempServe],
    addRootSlash: false,
    name: 'head'
  };
  var injectAssetScripts = gulp.src([
    options.config.assetsJS,
    // options.config.assetsJS,
    '!' + options.config.assetsOffersJS
  ]);


  gulp.task('inject:assetjs',function(){
    return gulp.src(options.config.srcHTML).pipe($.inject(injectAssetScripts, injectAssetOptions))
      .pipe(gulp.dest(options.config.tempServe));

  });
  gulp.task('inject', ['scripts', 'styles', 'yml', 'templates' ], function () {
    var injectMainOptions= {
      ignorePath: [options.config.srcDir, options.config.tempServe],
      addRootSlash: false,
      name: 'main' };

    var injectMainCSS = gulp.src([
      options.config.inject.mainCSS
    ], { read: false });
    var injectCustomThemeOptions= {
      ignorePath: [options.config.srcDir, options.config.tempServe],
      addRootSlash: false,
      name: 'custom' };
    var injectCustomThemeCSS = gulp.src([
      options.config.inject.customThemeCSS
    ], { read: false });

    var injectStyles = gulp.src([
      options.config.inject.tempCSS,
      '!' + options.config.inject.mainCSS,
      '!' + options.config.inject.customThemeCSS,
      options.config.inject.tempNonVendorCSS
    ], { read: false });

    var injectScripts = gulp.src([
      options.config.appJS,
      '!' + options.config.assetsOffersJS,
      '!' + options.config.appSpecJS,
      '!' + options.config.appMockJS
    ])
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));



    return gulp.src(options.config.srcHTML)
      .pipe($.inject(injectMainCSS, injectMainOptions))
      .pipe($.inject(injectCustomThemeCSS, injectCustomThemeOptions))
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe($.inject(injectAssetScripts, injectAssetOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.config.tempServe));

  });
};
