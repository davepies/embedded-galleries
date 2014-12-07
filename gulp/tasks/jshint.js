var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var handleErrors = require('../util/handleErrors');

var config = require('../config').jshint;

gulp.task('jshint', function () {

  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .on('error', handleErrors);

});


