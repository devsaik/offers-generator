'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
  /* already templates are added as a dependent module so commented this extra build step */
  /*gulp.task('partials', function () {
    return gulp.src([
      options.config.html,
      options.config.tempServeHTML
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'offersUI',
        root: 'app'
      }))
      .pipe(gulp.dest(options.config.partialsDestination));
  });

  gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(options.config.templateCachePath, { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.config.partialsDestination,
      addRootSlash: false
    };
    */
  gulp.task('html', ['inject'], function () {
    var htmlFilter = $.filter( options.config.filter.html);
    var jsFilter = $.filter(options.config.filter.js);
    var cssFilter = $.filter(options.config.filter.css);
    var assets;

    return gulp.src(options.config.tempServeHTML)
      /* already templates are added as a dependent module so commented this extra build step */
      //.pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.replace(/'use strict';/g, ''))
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest(options.config.dist ))
      .pipe($.size({ title: options.config.dist, showFiles: true }));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter(options.config.fontFilter))
      .pipe($.flatten())
      .pipe(gulp.dest(options.config.distFonts));
  });

  gulp.task('other', function () {
    return gulp.src([
     options.config.others.everything,
      options.config.others.allNonTypes
    ])
      .pipe(gulp.dest(options.config.dist + '/'));
  });

  gulp.task('clean', function (done) {
    $.del([options.config.dist + '/', options.config.temp + '/'], done);
  });

  gulp.task('build', ['html', 'fonts', 'other']);
};
