const path = require('path');
const gulp = require('gulp');

const gulpif = require('gulp-if');
const changed = require('gulp-changed');

const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const tcm = require('gulp-typed-css-modules');

const server = require('gulp-server-livereload');

const webpack = require('webpack');

// ---------- webpack
gulp.task('jsx', ['css'], ()=>{
    return jsxCompiler(false);
});

gulp.task('watch-jsx', ['css'], ()=>{
    return jsxCompiler(true);
});

// ---------- html
gulp.task('html', ()=>{
    return gulp.src(['./html/*.html'])
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

// ---------- css
// typed css modules.
gulp.task('css', ()=>{
    return gulp.src(['./src/**/*.css'])
    .pipe(changed('./', {extension: '.css.d.ts'}))
    .pipe(tcm({
        camelCase: true,
    }))
    .pipe(gulp.dest('./src'));
})

// ---------- static assets
gulp.task('static', ()=>{
    return gulp.src(['./html/*'])
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

// ---------- mc_canvas assets
gulp.task("mc_canvas-static",function(){
    return gulp.src("mc_canvas/Samples/*.gif")
    .pipe(changed("dist/"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('mc_canvas-uglify',function(){
    return gulp.src(["mc_canvas/Outputs/CanvasMasao.js","mc_canvas/Outputs/CanvasMasao_v28.js", "mc_canvas/Outputs/MasaoKani2_manual.js"])
    .pipe(changed("dist/"))
    .pipe(uglify())
    .pipe(gulpif(function(file){
        return path.basename(file.path)==="CanvasMasao_v28.js";
    },replace("CanvasMasao","CanvasMasao_v28")))
    .pipe(gulp.dest("dist/"));
});

gulp.task('mc_canvas', ['mc_canvas-static','mc_canvas-uglify']);

// ---------- server
gulp.task('server', ()=>{
    gulp.src('dist')
    .pipe(server({
        livereload: true,
        directoryListing: false,
        open: false,
        port: 8000,
    }));
});
// ----------

gulp.task('default', ['html', 'jsx', 'static', 'mc_canvas']);
gulp.task('watch', ['html', 'mc_canvas', 'watch-jsx', 'server'], ()=>{
    gulp.watch('html/*', ['html']);
    gulp.watch('src/**/*.css', ['css']);
});

// ----------
//
function jsxCompiler(watch){
  const compiler = webpack(require('./webpack.config.js'));

  const handleStats = (stats, watch)=>{
      console.log(stats.toString({
          chunks: !watch,
          colors: true,
      }));
  };
  if (watch){
      return compiler.watch({
      }, (err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, true);
      });
  }else{
      return compiler.run((err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, false);
      });
  }
}
