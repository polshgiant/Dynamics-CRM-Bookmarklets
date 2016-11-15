var esc = require('../plugins/escape'),
    hf = require('gulp-headerfooter'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    gutil = require('gulp-util');

module.exports = function defineTask(gulp, srcDir, destDir) {

    return function buildBookmarklets() {
        return gulp.src('./src/' + srcDir + '!(intro.js|outro.js|old)')
            //.on('end', function(){ gutil.log('gulp.src done... [' + srcDir + ']'); })
            .pipe(hf.header('./src/' + srcDir + 'intro.js'))
            .pipe(hf.footer('./src/' + srcDir + 'outro.js'))
            //.on('end', function(){ gutil.log('header and footer done... [' + srcDir + ']'); })
            .pipe(uglify({
                compress: {
                    // Prevent fn wrapper from being mangled for FireFox
                    negate_iife: false
                }
            }))
            // Nested quotes cause issues when the script is embedded in an 
            //  anchor tag.
            .pipe(esc())
            //.on('end', function(){ gutil.log('escape done... [' + destDir + ']'); })
            .pipe(gulp.dest('./dist/' + destDir));
    };

};