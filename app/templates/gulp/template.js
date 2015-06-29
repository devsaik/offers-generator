/**
 * Created by rca733 on 6/22/15.
 */
'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({lazy: true});

module.exports = function(options) {
  gulp.task('templates', function () {
    return gulp.src(options.config.app_files.ctpl)
      .pipe($.angularTemplatecache({
        standalone: true,
        output: 'templates.js',
        minify: {}
//				root: '../'
      })).pipe(gulp.dest(options.config.appUtils));
  });
  gulp.task('templates-temp', function () {
    return gulp.src(options.config.app_files.ctpl)
      .pipe($.angularTemplatecache({
        standalone: true,
        output: 'templates.js',
        minify: {}
//				root: '../'
      })).pipe(gulp.dest(options.config.appUtils));
  });
  //gulp.task('help', $.taskListing);
};
