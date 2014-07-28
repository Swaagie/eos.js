'use strict';

var nib = require('nib')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , stylus = require('gulp-stylus')
  , sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['script', 'style']);

//
// Define Gulp task to concat and minifiy scripts.
//
gulp.task('script', function script() {
  return gulp.src('client/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('eos.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

//
// Gulp task to generate CSS from stylus files.
//
gulp.task('style', function style() {
  return gulp.src('client/css/*.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(concat('eos.min.css'))
    .pipe(gulp.dest('dist'));
});