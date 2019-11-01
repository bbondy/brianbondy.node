var gulp = require('gulp')
var babel = require('gulp-babel')
var changed = require('gulp-changed')
var standard = require('gulp-standard')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var del = require('del')
var less = require('gulp-less')
var server = require('gulp-develop-server')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')

var browserify = require('browserify')
var source = require('vinyl-source-stream')
var createPDF = require('./src/createPDF.js')
var http = require('http')

const SRC_ROOT = './src/'
const SRC_ROOT_PUBLIC = './src/public/'
const SRC_ROOT_PUBLIC_LESS = './src/public/less/'
const SRC_ROOT_PUBLIC_JS = './src/public/js/'
const DIST_ROOT = './dist/'
const DIST_ROOT_PUBLIC = './dist/public'
const DIST_ROOT_PUBLIC_JS = './dist/public/js/'
const DIST_CSS_ROOT = './dist/public/css'
const TEST_ROOT = './test/'
const SERVER_FILES = [
  SRC_ROOT + 'server.js',
  SRC_ROOT + 'redirects.js',
  SRC_ROOT + 'blogPostManifest.js',
  SRC_ROOT + 'titleByPath.js',
  SRC_ROOT + 'cache.js',
  SRC_ROOT + 'marked.js',
  SRC_ROOT + 'helpers.js',
  SRC_ROOT + 'slugify.js',
  SRC_ROOT + '*__tests__*/*'
]

const COPY_SERVER_FILES = [
  SRC_ROOT + '*templates*/*.jade'
]

const COPY_WEB_APP_FILES = [
  SRC_ROOT_PUBLIC + '**/*',
  '!' + SRC_ROOT_PUBLIC + '**/js/*.js', // JS files are handled by babel, so don't copy them.
  '!' + SRC_ROOT_PUBLIC_LESS + 'less/**', // LESS files are handled by less, so don't copy them.
  '!' + SRC_ROOT_PUBLIC_LESS
]
const COPY_WELL_KNOWN_FILES = [
  SRC_ROOT_PUBLIC + '.well-known/**/*'
]

const DEFAULT_PORT = 32757
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Copy all non-js directory app source/assets/components.
 */
function copyServerFiles () {
  return gulp.src(COPY_SERVER_FILES)
    .pipe(gulp.dest(DIST_ROOT))
}

function bundleJS () {
  return browserify({
    entries: './src/public/js/init.js',
    debug: true
  })
    .transform('babelify', { presets: ['@babel/preset-env', '@babel/preset-react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(IS_PRODUCTION ? sourcemaps.init({ loadMaps: true }) : gutil.noop())
    .pipe(IS_PRODUCTION ? uglify() : gutil.noop())
    .pipe(IS_PRODUCTION ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest('./dist/public/js'))
}

function createResumePDF (cb) {
  createPDF('http://localhost:' + DEFAULT_PORT, cb)
}

function startServer () {
  server.listen({ path: './dist/server.js' })
}

/**
 * Runs linters on all javascript files found in the src dir.
 */
function lint () {
  return gulp.src([
    SRC_ROOT + '/**/*.js',
    './gulpfile.js',
    '!' + SRC_ROOT + 'js/ext/*.js'
  ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false
    }))
}

/**
 * Convert less stylesheets to css
 */
function lessTask () {
  return gulp.src([
    SRC_ROOT_PUBLIC_LESS + '**/*.less',
    // These are imported by font-awesome.less
    '!' + SRC_ROOT + 'public/less/font-awesome/!(font-awesome).less'
  ])
    .pipe(changed(DIST_CSS_ROOT, { extension: '.css' }))
    .pipe(sourcemaps.init())
    .pipe(less().on('error', function (e) {
      console.log('error running less', e)
      this.emit('end')
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_CSS_ROOT))
}

function refresh (cb) {
  return http.get('http://localhost:' + DEFAULT_PORT + '/refresh', function (res) {
    res.on('end', function () {
      cb()
    })
  })
}

/**
 * Copy all public non-js directory app source/assets/components.
 */
function copyPublicStatic () {
  return gulp.src(COPY_WEB_APP_FILES)
    .pipe(gulp.dest(DIST_ROOT_PUBLIC))
}

function copyWellKnown () {
  return gulp.src(COPY_WELL_KNOWN_FILES)
    .pipe(gulp.dest(DIST_ROOT_PUBLIC))
}

/**
 * Copy analytics
 */
function copyAnalytics () {
  return gulp.src([SRC_ROOT_PUBLIC_JS + 'analytics.js'])
    .pipe(gulp.dest(DIST_ROOT_PUBLIC_JS))
}

/**
 * Converts javascript to es5. This allows us to use harmony classes and modules.
 */
function babelNode () {
  try {
    return gulp.src(SERVER_FILES)
      .pipe(IS_PRODUCTION ? gutil.noop() : sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/preset-env', '@babel/preset-react']
      })).on('error', function (e) {
        console.log('error on babel-node: ' + e)
        this.emit('end')
      })
      .pipe(IS_PRODUCTION ? gutil.noop() : sourcemaps.write('.'))
      .pipe(gulp.dest(DIST_ROOT))
  } catch (e) {
    console.log('Got error in babel', e)
  }
}

/**
 * Watch for changes on the file system, and rebuild if so.
 */
function watch () {
  gulp.watch(SERVER_FILES, gulp.series(babelNode, copyServerFiles, server.restart))
  gulp.watch([SRC_ROOT_PUBLIC_JS + '**/*'], gulp.series(lint, bundleJS))
  gulp.watch([SRC_ROOT_PUBLIC_LESS + '**/*'], lessTask)
  gulp.watch([TEST_ROOT + '**/*'], lint)
  gulp.watch(COPY_WEB_APP_FILES, gulp.series(copyPublicStatic, refresh))
}

/**
 * Remove the distributable files.
 */
function clobber (cb) {
  del('dist/**', cb)
}

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
function clean (cb) {
  del([
    'dist/',
    'node_modules/'
  ], cb)
}

const build = gulp.series(copyPublicStatic, copyWellKnown, copyAnalytics, copyServerFiles, babelNode, lint, bundleJS, lessTask)

module.exports = {
  default: gulp.series(build, watch, startServer),
  build,
  startServer,
  clobber,
  clean,
  lint,
  createResumePDF
}
