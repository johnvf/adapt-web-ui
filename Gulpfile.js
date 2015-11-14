'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    browserify = require('gulp-browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    refresh = require('gulp-livereload'),
    buffer = require('vinyl-buffer'),
    nodemon = require('gulp-nodemon');

// Flag to keep livereload working properly, feels hacky
var isWatching = false;

var expressServer = require('./server');
gulp.task('serve_', function() {
  console.log('Server');
  expressServer.startServer();
});

gulp.task('serve', function () {
  nodemon({ script: 'server.js', ext: 'json js', ignore: ['./public/*', './client/*'] })
  .on('change', ['lint'])
  .on('restart', function () {
    console.log('Restarted webserver')
  });
});

// JSLint task
gulp.task('lint', function() {
  gulp.src('./client/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
  gulp.src('./client/styles/main.scss')
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(sass({onError: function(e) { console.log(e); } }))
  // Optionally add autoprefixer
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  // These last two should look familiar now :)
  // Concatenate imported external CSS
  .pipe( concatCss('/main.css') )
  .pipe(gulp.dest('./public/css/'))

});

gulp.task('browserify', function() {
  return gulp.src('./client/scripts/main.js')
  .pipe(browserify({
    debug: true
  }))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat('main.js'))
  // .pipe(uglify({mangle: false}))
  .pipe(rename({ suffix: '.min'}))
  .pipe(sourcemaps.write('./'))
  .pipe( gulp.dest('./public/js') )
  // isWatching = true
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('./client/index.html')
  // And put it in the public folder
  .pipe(gulp.dest('./public/'));

  // Any other view files from client/views
  gulp.src('./client/views/**/*')
  // Will be put in the public/views folder
  .pipe(gulp.dest('./public/views/'));
});

gulp.task('watch', ['serve', 'lint'], function() {
  isWatching = true
  // Start live reload server
  refresh.listen();

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['./client/scripts/*.js', './client/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);

  // Watch our sass files
  gulp.watch(['./client/styles/**/*.scss'], [
    'styles'
  ]);

  // Watch view files
  gulp.watch(['./client/**/*.html'], [
    'views'
  ]);

  gulp.watch('./public/**').on('change', refresh.changed);
});

gulp.on('stop', function() {
    if (!isWatching) {
        process.nextTick(function() {
            process.exit(0);
        });
    }
});

// Dev task
gulp.task('dev', ['views', 'styles', 'lint', 'browserify', 'watch'], function() {});

// Build task
gulp.task('build', ['views', 'styles', 'lint', 'browserify'], function() {});

gulp.task('default', ['dev']);