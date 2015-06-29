'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');

module.exports = function(options) {
  gulp.task('scripts', function () {
    del('./jshint-output.log');
    return gulp.src(options.config.jshint.src)
      .pipe($.jshint({ 'strict':false,'globalstrict':true,'quotmark':false,'camelcase':false,'evil': true,'newcap':false, 'globals': {'angular':false,'$':false,'_':false,
        'window':false,
        'describe': false,
        'it': false,
        'before': false,
        'beforeEach': false,
        'inject': false,
        'module':false,
        'after': false,
        'document': false,
        'escape':false,
        'console':false,
        'alert':false,
        'moment': false,
        'File':false,
        'FileReader':false,
        'Image':false,
        'atob' : false,
        'Uint8Array':false,
        'Blob':false,
        'setTimeout':false,
        'afterEach': false,
        'expect': false}}))
     // .pipe($.jshint.reporter('jshint-stylish',{ verbose: true }))
      .pipe($.jshint.reporter('gulp-jshint-file-reporter', {
        filename:'./'+ 'jshint-output.log'}))
      .pipe(browserSync.reload({ stream: true}))
      .pipe($.size());
  });
  //gulp.task('help', $.taskListing);
};
