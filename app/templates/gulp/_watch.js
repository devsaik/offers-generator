'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch', ['inject', 'yml'], function () {

    gulp.watch([options.config.srcOneLevelHTML, 'bower.json'], ['inject']);

    gulp.watch([
      options.config.srcStyles.allStyles

    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch([options.config.appJS], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });
    gulp.watch([options.config.config_json,options.config.config_yml], function() {
      gulp.start('scripts');
    });

    gulp.watch(options.config.htmltemplates, function(event) {
      browserSync.reload(event.path);
    });
  });
};
