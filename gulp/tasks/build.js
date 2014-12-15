var gulp = require('gulp');

gulp.task('build', ['browserify', 'uglify', 'sass', 'images', 'markup']);
