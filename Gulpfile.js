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
    less = require('gulp-less'),
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
  gulp.src('client/less/main.less')
  .pipe(less({}))
  // Optionally add autoprefixer
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  // These last two should look familiar now :)
  // Concatenate imported external CSS
  .pipe( concatCss('main.css') )
  .pipe(gulp.dest('public/css/'))
});

gulp.task('browserify', function() {
  return gulp.src('./client/js/App.js')
  .pipe(browserify({
    debug: true,
    transform: 'reactify'
  }))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat('main.js'))
  // .pipe(uglify({mangle: false}))
  .pipe(rename({ suffix: '.min'}))
  .pipe(sourcemaps.write('./'))
  .pipe( gulp.dest('./public/js') )
  // isWatching = true
});


gulp.task('copy', function() {
  gulp.src('./client/index.html')
    .pipe(gulp.dest('./public'));
  gulp.src('./client/favicon.ico')
    .pipe(gulp.dest('./public'));    
  gulp.src('./client/lib/**/*.*')
    .pipe(gulp.dest('./public/js'));
  gulp.src('./client/img/**/*.*')
    .pipe(gulp.dest('./public/img'));
  gulp.src('./client/fonts/**/*.*')
    .pipe(gulp.dest('./public/fonts'));    
  gulp.src('./node_modules/bootstrap/fonts/**/*.*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('watch', ['serve', 'lint'], function() {
  isWatching = true
  // Start live reload server
  refresh.listen();

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['./client/js/*.js', './client/js/**/*.js'],[
    'lint',
    'browserify'
  ]);

  // Watch our sass files
  gulp.watch(['./client/less/**/*.less'], [
    'styles'
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
gulp.task('dev', ['styles', 'lint', 'browserify', 'copy' , 'watch'], function() {});

// Build task
gulp.task('build', ['styles', 'lint', 'browserify', 'copy'], function() {});

gulp.task('default', ['dev']);