var gulp = require('gulp');
var jest = require('gulp-jest');
var handleErrors = require('../util/handleErrors');

var config = require('../config').jest;

gulp.task('jest', function () {

    return gulp.src(config.src)
        .pipe(jest())
        .on('error', handleErrors);

});
