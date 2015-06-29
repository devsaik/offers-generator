/**
 * Created by rca733 on 6/24/15.
 */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var spritesmith = require('gulp.spritesmith');
var $ = require('gulp-load-plugins')({lazy: true});

module.exports = function(options) {
  gulp.task('sprite', function () {
    var spriteSite = gulp.src(options.config.sprite.imgSrc).pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.styl',
      padding: 5,
      algorithm: 'top-down',
      cssFormat: 'stylus',
      cssTemplate: options.config.sprite.cssTemplate
    }));

    spriteSite.img.pipe(gulp.dest(options.config.sprite.imgDest));
    spriteSite.css.pipe(gulp.dest(options.config.sprite.cssDest));

    var spriteApp = gulp.src(options.config.sprite.spriteSrc).pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.styl',
      padding: 5,
      algorithm: 'top-down',
      cssFormat: 'stylus',
      cssTemplate: options.config.sprite.cssTemplate
    }));

    spriteApp.img.pipe(gulp.dest(options.config.sprite.assetsImgDest));
    spriteApp.css.pipe(gulp.dest(options.config.sprite.appSpriteDest));
  });

};
