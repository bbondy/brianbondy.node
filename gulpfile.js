var gulp = require('gulp');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var eslint = require('gulp-eslint');
var less = require('gulp-less');
var runSequence = require('run-sequence');
var nodemon = require('nodemon');
var fs = require('fs');

const SRC_ROOT = './src/';
const DIST_ROOT = './dist/';
const DIST_ROOT_PUBLIC_JS = './dist/public/js';
const DIST_EXT = './dist/public/js/ext/';
const DIST_CSS_ROOT = './dist/css';
const TEST_ROOT = './test/';

const DEFAULT_PORT = 8000;
const DEFAULT_HOST = 'localhost';

gulp.task('start-server', function () {
  nodemon({
    script: 'dist/server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
})

/**
 * Runs linters on all javascript files found in the src dir.
 */
gulp.task('lint', function() {
  return gulp.src([
      SRC_ROOT + 'js/**/*.js',
      TEST_ROOT + '**/*.js',
      '!' + SRC_ROOT + 'js/ext/*.js',
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gutil.noop());
});

/**
 * Convert less stylesheets to css
 */
gulp.task('less', function () {
  return gulp.src([
      SRC_ROOT + 'less/**/*.less',
      // These are imported by font-awesome.less
      '!' + SRC_ROOT + 'less/font-awesome/!(font-awesome).less',
    ])
    .pipe(changed(DIST_CSS_ROOT, {extension: '.css'}))
    .pipe(sourcemaps.init())
    .pipe(less().on('error', function(e) {
        console.log('error running less', e);
        this.emit('end');
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_CSS_ROOT));
});


/**
 * Setup steps after an npm install.
 */
gulp.task('install', ['copy-web-app', 'copy-node-modules']);


/**
 * Copy all non-js directory app source/assets/components.
 */
gulp.task('copy-web-app', function() {
  return gulp.src([
      SRC_ROOT + '**',
      '!' + SRC_ROOT + '/**/js/*.js', // JS files are handled by babel, so don't copy them.
      '!' + SRC_ROOT + 'less/**', // LESS files are handled by less, so don't copy them.
      '!' + SRC_ROOT + 'less'
    ])
    .pipe(gulp.dest(DIST_ROOT));
});

gulp.task('copy-node-modules', function() {
 return gulp.src([
      './node_modules/react/dist/react.js',
      './node_modules/immutable/dist/immutable.js',
      './node_modules/requirejs/require.js',
    ])
    .pipe(gulp.dest(DIST_EXT));
});

/**
 * Converts javascript to es5. This allows us to use harmony classes and modules.
 */
gulp.task('babel-node', function() {
  var files = [
    SRC_ROOT + 'server.js',
  ];
  try {
    return gulp.src(files)
      .pipe(changed(DIST_ROOT + 'js/'))
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.init())
      .pipe(babel({ modules: 'common'} ).on('error', function(e) {
        this.emit('end');
      }))
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.write('.'))
      .pipe(gulp.dest(DIST_ROOT));

  } catch (e) {
    console.log('Got error in babel', e);
  }
});

/**
 * Converts javascript to es5. This allows us to use harmony classes and modules.
 */
gulp.task('babel-web', function() {
  var files = [
    SRC_ROOT + 'public/js/**/*.js',
    '!' + SRC_ROOT + 'public/js/ext/*.js' // do not process external files
  ];
  try {
    return gulp.src(files)
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.init())
      .pipe(babel({ modules: 'amd'} ).on('error', function(e) {
        this.emit('end');
      }))
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.write('.'))
      .pipe(gulp.dest(DIST_ROOT_PUBLIC_JS));

  } catch (e) {
    console.log('Got error in babel', e);
  }
});


/**
 * Build the app.
 */
gulp.task('build', function(cb) {
  runSequence(['clobber'], ['copy-web-app', 'copy-node-modules', 'babel-node', 'babel-web', 'lint', 'less'], cb);
});

/**
 * Watch for changes on the file system, and rebuild if so.
 */
gulp.task('watch', function() {
  gulp.watch([
    SRC_ROOT + '**/*',
  ], ['build']);
  gulp.watch([TEST_ROOT + '**/*'], ['lint']);
});

/**
 * The default task when `gulp` is run.
 * Adds a listener which will re-build on a file save.
 */
gulp.task('default', function() {
  runSequence('build', 'watch', 'start-server');
});

/**
 * Remove the distributable files.
 */
gulp.task('clobber', function(cb) {
  del('dist/**', cb);
});

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
gulp.task('clean', function(cb) {
  del([
    'dist/',
    'node_modules/'
  ], cb);
});
