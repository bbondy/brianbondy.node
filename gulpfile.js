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

var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

const SRC_ROOT = './src/';
const SRC_ROOT_PUBLIC_LESS = './src/public/less/';
const SRC_ROOT_PUBLIC_JS = './src/public/js/';
const DIST_ROOT = './dist/';
const DIST_ROOT_PUBLIC_JS = './dist/public/js';
const DIST_EXT = './dist/public/js/ext/';
const DIST_CSS_ROOT = './dist/public/css';
const TEST_ROOT = './test/';

const DEFAULT_PORT = 8000;
const DEFAULT_HOST = 'localhost';

gulp.task('bundle-js', function() {
  browserify({
    entries: './src/public/js/init.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./dist/public/js'));
});


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
      SRC_ROOT_PUBLIC_LESS + '**/*.less',
      // These are imported by font-awesome.less
      '!' + SRC_ROOT + 'public/less/font-awesome/!(font-awesome).less',
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
gulp.task('install', ['copy-web-app']);


/**
 * Copy all non-js directory app source/assets/components.
 */
gulp.task('copy-web-app', function() {
  return gulp.src([
      SRC_ROOT + '**',
      '!' + SRC_ROOT + '/**/js/*.js', // JS files are handled by babel, so don't copy them.
      '!' + SRC_ROOT + 'public/less/**', // LESS files are handled by less, so don't copy them.
      '!' + SRC_ROOT + 'public/less'
    ])
    .pipe(gulp.dest(DIST_ROOT));
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
 * Build the app.
 */
gulp.task('build', function(cb) {
  runSequence(['copy-web-app', 'babel-node', 'bundle-js', 'lint', 'less'], cb);
});

/**
 * Watch for changes on the file system, and rebuild if so.
 */
gulp.task('watch', function() {
  gulp.watch([
    SRC_ROOT + 'server.js',
  ], ['babel-node']);
  gulp.watch([
    SRC_ROOT_PUBLIC_JS + '**/*',
  ], ['bundle-js']);
  gulp.watch([
    SRC_ROOT_PUBLIC_LESS + '**/*',
  ], ['less']);
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
