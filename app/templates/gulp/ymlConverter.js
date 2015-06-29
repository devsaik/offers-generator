/**
 * Created by rca733 on 6/23/15.
 */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var es = require('event-stream');
var $ = require('gulp-load-plugins')({lazy: true});

module.exports = function(options) {
  gulp.task('yml', function () {
    var json_cfg = gulp.src(options.config.config_json);
    var yml_cfg = gulp.src(options.config.config_yml)
      .pipe($.yaml());

    return es.merge(json_cfg, yml_cfg)
      .pipe($.extend("config.json"))
      .pipe($.ngConstant({
        name: 'config',
      }))
      .pipe(gulp.dest(options.config.appUtils))

    });
  //gulp.task('help', $.taskListing);
}


