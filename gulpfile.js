'use static';

const path = require('path');
const gulp = require('gulp');

const gulpif = require('gulp-if');
const changed = require('gulp-changed');

const uglifyComposer = require('gulp-uglify/composer');
const replace = require('gulp-replace');
const tcm = require('gulp-typed-css-modules');

const connect = require('connect');
const serveStatic = require('serve-static');
const connectLivereload = require('connect-livereload');
const liveReload = require('gulp-livereload');

const webpack = require('webpack');

// ---------- css
// typed css modules.
gulp.task('css', () => {
  return gulp
    .src(['./src/**/*.css'])
    .pipe(changed('./', { extension: '.css.d.ts' }))
    .pipe(
      tcm({
        camelCase: true,
      }),
    )
    .pipe(gulp.dest('./src'));
});

// ---------- webpack
gulp.task(
  'jsx',
  gulp.series('css', cb => {
    return jsxCompiler(false, cb);
  }),
);

gulp.task(
  'watch-jsx',
  gulp.series('css', cb => {
    jsxCompiler(true, cb);
  }),
);

// ---------- html
gulp.task('html', () => {
  return gulp
    .src(['./html/*.html'])
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

// ---------- static assets
gulp.task('static', () => {
  return gulp
    .src(['./html/*'])
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

// ---------- mc_canvas assets
gulp.task('mc_canvas-static', function() {
  return gulp
    .src('mc_canvas/Samples/*.gif')
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

const uglify = uglifyComposer(require('uglify-es'), console);

gulp.task('mc_canvas-uglify', function() {
  return gulp
    .src([
      'mc_canvas/Outputs/CanvasMasao.js',
      'mc_canvas/Outputs/CanvasMasao_v28.js',
      'mc_canvas/Outputs/MasaoKani2_manual.js',
    ])
    .pipe(changed('dist/'))
    .pipe(uglify())
    .pipe(
      gulpif(function(file) {
        return path.basename(file.path) === 'CanvasMasao_v28.js';
      }, replace('CanvasMasao', 'CanvasMasao_v28')),
    )
    .pipe(gulp.dest('dist/'));
});

gulp.task('mc_canvas', gulp.series('mc_canvas-static', 'mc_canvas-uglify'));

// ---------- server
gulp.task('server', () => {
  // serve dist files using connect.
  connect()
    .use(connectLivereload())
    .use(serveStatic('dist/'))
    .listen(8000, '0.0.0.0');
  // open livereload server.
  liveReload.listen();
});
// ----------

gulp.task('default', gulp.series('html', 'jsx', 'static', 'mc_canvas'));
gulp.task(
  'watch',
  gulp.series('html', 'mc_canvas', 'watch-jsx', 'server', () => {
    gulp.watch('html/*', ['html']);
    gulp.watch('src/**/*.css', ['css']);
  }),
);

// ----------
//
function jsxCompiler(watch, cb) {
  const compiler = webpack(require('./webpack.config.js'));

  const handleStats = (stats, watch) => {
    console.log(
      stats.toString({
        chunks: !watch,
        colors: true,
      }),
    );
  };
  if (watch) {
    cb();
    return compiler.watch({}, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      handleStats(stats, true);
      liveReload.reload();
    });
  } else {
    return compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      handleStats(stats, false);
      cb();
    });
  }
}
