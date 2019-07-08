var gulp = require('gulp');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var standard = require('gulp-standard')
var less = require('gulp-less');
var runSequence = require('run-sequence');
var server = require( 'gulp-develop-server' );
var fs = require('fs');
var shell = require('gulp-shell');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var createPDF = require('./src/createPDF.js');
var http = require('http');

const SRC_ROOT = './src/';
const SRC_ROOT_PUBLIC = './src/public/';
const SRC_ROOT_PUBLIC_LESS = './src/public/less/';
const SRC_ROOT_PUBLIC_JS = './src/public/js/';
const DIST_ROOT = './dist/';
const DIST_ROOT_PUBLIC = './dist/public';
const DIST_ROOT_PUBLIC_JS = './dist/public/js/';
const DIST_EXT = './dist/public/js/ext/';
const DIST_CSS_ROOT = './dist/public/css';
const TEST_ROOT = './test/';
const SERVER_FILES = [
  SRC_ROOT + 'server.js',
  SRC_ROOT + 'secrets.js',
  SRC_ROOT + 'redirects.js',
  SRC_ROOT + 'blogPostManifest.js',
  SRC_ROOT + 'titleByPath.js',
  SRC_ROOT + 'sendEmail.js',
  SRC_ROOT + 'cache.js',
  SRC_ROOT + 'marked.js',
  SRC_ROOT + 'helpers.js',
  SRC_ROOT + 'slugify.js',
  SRC_ROOT + '*__tests__*/*',
];

const COPY_SERVER_FILES = [
  SRC_ROOT + '*templates*/*.jade',
];

const COPY_WEB_APP_FILES = [
  SRC_ROOT_PUBLIC + '**/*',
  '!' + SRC_ROOT_PUBLIC + '**/js/*.js', // JS files are handled by babel, so don't copy them.
  '!' + SRC_ROOT_PUBLIC_LESS + 'less/**', // LESS files are handled by less, so don't copy them.
  '!' + SRC_ROOT_PUBLIC_LESS,
];
const COPY_WELL_KNOWN_FILES = [
  SRC_ROOT_PUBLIC + '.well-known/**/*',
]

const DEFAULT_PORT = 32757;
const DEFAULT_HOST = 'localhost';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

gulp.task('bundle-js', function() {
  browserify({
    entries: './src/public/js/init.js',
    debug: true
  })
  .transform('babelify', {presets: ['react', 'es2015']})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(IS_PRODUCTION ? sourcemaps.init({loadMaps: true}) : gutil.noop())
  .pipe(IS_PRODUCTION ? uglify() : gutil.noop())
  .pipe(IS_PRODUCTION ? sourcemaps.write('./') : gutil.noop())
  .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('start-redis', function() {
  return gulp.src('')
    .pipe(shell([
      'redis-server src/redis.conf']));
});

gulp.task('create-resume-pdf', function(cb) {
  createPDF('http://localhost:' + DEFAULT_PORT, cb);
});

gulp.task('start-server', function () {
  server.listen( { path: './dist/server.js' } );
});

/**
 * Runs linters on all javascript files found in the src dir.
 */
gulp.task('lint-node', function() {
  return gulp.src(SERVER_FILES)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false
    }))
    .pipe(gutil.noop());
});



/**
 * Runs linters on all javascript files found in the src dir.
 */
gulp.task('lint-js', function() {
  return gulp.src([
      SRC_ROOT + 'public/js/**/*.js',
      TEST_ROOT + '**/*.js',
      '!' + SRC_ROOT + 'js/ext/*.js',
      '!' + SRC_ROOT + 'public/js/analytics.js',
    ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false
    }))
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
gulp.task('install', ['copy-public-static']);


gulp.task('refresh', function(cb) {
  return http.get('http://localhost:' + DEFAULT_PORT + '/refresh' , function (res) {
    res.on('end', function () {
      cb();
    });
  });
});

/**
 * Copy all public non-js directory app source/assets/components.
 */
gulp.task('copy-public-static', function() {
  return gulp.src(COPY_WEB_APP_FILES)
    .pipe(gulp.dest(DIST_ROOT_PUBLIC));
});

gulp.task('copy-well-known', function() {
  return gulp.src(COPY_WELL_KNOWN_FILES)
    .pipe(gulp.dest(DIST_ROOT_PUBLIC));
});

/**
 * Copy all non-js directory app source/assets/components.
 */
gulp.task('copy-server-files', function() {
  return gulp.src(COPY_SERVER_FILES)
    .pipe(gulp.dest(DIST_ROOT));
});

/**
 * Copy analytics
 */
gulp.task('copy-analytics', function() {
  return gulp.src([SRC_ROOT_PUBLIC_JS + 'analytics.js'])
    .pipe(gulp.dest(DIST_ROOT_PUBLIC_JS));
});

/**
 * Converts javascript to es5. This allows us to use harmony classes and modules.
 */
gulp.task('babel-node', function() {
  try {
    return gulp.src(SERVER_FILES)
      .pipe(IS_PRODUCTION ? gutil.noop() : sourcemaps.init())
      .pipe(babel({
        presets: ['react', 'es2015']
      })).on('error', function(e) {
        console.log('error on babel-node: ' + e);
        this.emit('end');
      })
      .pipe(IS_PRODUCTION ? gutil.noop() : sourcemaps.write('.'))
      .pipe(gulp.dest(DIST_ROOT));

  } catch (e) {
    console.log('Got error in babel', e);
  }
});

/**
 * Build the app.
 */
gulp.task('build', function(cb) {
  runSequence(['copy-public-static', 'copy-well-known', 'copy-analytics', 'copy-server-files', 'babel-node', 'bundle-js', 'lint-node', 'lint-js', 'less'], cb);
});

/**
 * All lint
 */
gulp.task('lint', function(cb) {
  runSequence(['lint-node', 'lint-js'], cb);
});

/**
 * Watch for changes on the file system, and rebuild if so.
 */
gulp.task('watch', function() {
  gulp.watch(SERVER_FILES, ['lint-node', 'babel-node', 'copy-server-files', server.restart]);
  gulp.watch([
    SRC_ROOT_PUBLIC_JS + '**/*',
  ], ['lint-js', 'bundle-js']);
  gulp.watch([
    SRC_ROOT_PUBLIC_LESS + '**/*',
  ], ['less']);
  gulp.watch([TEST_ROOT + '**/*'], ['lint-js']);
  gulp.watch([COPY_WEB_APP_FILES], ['copy-public-static-and-refresh'])
});

gulp.task('copy-public-static-and-refresh', function(cb) {
  runSequence('copy-public-static', 'refresh', cb);
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
