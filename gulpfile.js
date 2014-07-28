'use strict';

var nib = require('nib')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , stylus = require('gulp-stylus')
  , sourcemaps = require('gulp-sourcemaps');

//
// Set production flag, useful to exclude sourcemaps.
//
var map = process.env.SOURCEMAPS === 'true';

gulp.task('default', ['script', 'style']);

//
// Define Gulp task to concat and minifiy scripts.
//
gulp.task('script', function script() {
  var work = gulp.src('client/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('eos.min.js'));

  //
  // Only write the source map if we are not building for production.
  //
  if (map) work.pipe(sourcemaps.write());

  return work.pipe(gulp.dest('dist'));
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