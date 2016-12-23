var _ = require('lodash'),
    gulp = require('gulp'),
    clean = require('./src/gulp/tasks/clean'),
    compileBookmarklets = require('./src/gulp/tasks/compile-bookmarklets'),
    buildLauncher = require('./src/gulp/tasks/build-launcher'),
    transformContent = require('./src/gulp/tasks/transform-content'),
    copyStatic = require('./src/gulp/tasks/copy-static');

gulp.task('clean', clean(gulp));

gulp.task('build-bookmarklets-admin', ['clean'], 
    compileBookmarklets(gulp, 'bookmarklets/admin/', 'bookmarklets/admin/'));

gulp.task('build-bookmarklets-record', ['clean'], 
    compileBookmarklets(gulp, 'bookmarklets/record/', 'bookmarklets/record/'));

gulp.task('build-bookmarklets-old', ['clean'], 
    compileBookmarklets(gulp, 'bookmarklets/old/', 'bookmarklets/old/', 'bookmarklets/old/'));

gulp.task('build-launcher', ['build-bookmarklets-admin', 'build-bookmarklets-record'], buildLauncher(gulp));

gulp.task('transform-content', 
    [
        'build-bookmarklets-old', 
        'build-bookmarklets-admin', 
        'build-bookmarklets-record',
        'build-launcher'
    ], 
    transformContent(gulp));

gulp.task('copy-static',  ['transform-content'], copyStatic(gulp));

gulp.task('default', ['copy-static']);