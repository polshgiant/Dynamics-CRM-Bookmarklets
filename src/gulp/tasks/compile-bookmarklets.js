var esc = require('../plugins/escape'),
    hf = require('gulp-headerfooter'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    gutil = require('gulp-util'),
    filelog = require('gulp-filelog');

module.exports = function defineTask(gulp, srcDir, destDir, introOutroDir) {
    introOutroDir = introOutroDir || "bookmarklets/";
    srcDir = srcDir.endsWith('/') ? srcDir : srcDir + "/";
    
    return function compileBookmarklets() {
        var srcGlob = './src/' + srcDir + '!(intro.js|outro.js|old)';
        return gulp.src(srcGlob)
            //.pipe(filelog(srcGlob))
            //.on('end', function(){ gutil.log('gulp.src done... [' + srcDir + ']'); })
            .pipe(hf.header('./src/' + introOutroDir + 'intro.js'))
            .pipe(hf.footer('./src/' + introOutroDir + 'outro.js'))
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