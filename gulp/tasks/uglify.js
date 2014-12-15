var gulp   = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var size = require('gulp-size');

var config = require('../config').uglify;

var handleErrors = require('../util/handleErrors');

gulp.task('uglify', ['browserify'], function () {

    return gulp.src(config.src)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(size({ gzip: true }))
        .pipe(gulp.dest(config.dest))
        .on('error', handleErrors);

});
