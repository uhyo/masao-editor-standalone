const path = require('path');
const gulp = require('gulp');

const gulpif = require('gulp-if');
const changed = require('gulp-changed');

const uglify = require('gulp-uglify');
const replace = require('gulp-replace');

const server = require('gulp-server-livereload');

const webpack = require('webpack');

// ---------- webpack
gulp.task('jsx', ()=>{
    return jsxCompiler(false);
});

gulp.task('watch-jsx', ()=>{
    return jsxCompiler(true);
});

// ---------- static assets
gulp.task('static', ()=>{
    gulp.src(['./html/*'])
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
    return gulp.src(["mc_canvas/Outputs/CanvasMasao.js","mc_canvas/Outputs/CanvasMasao_v28.js"])
    .pipe(changed("dist/"))
    .pipe(uglify())
    .pipe(gulpif(function(file){
        return path.basename(file.path)==="CanvasMasao_v28.js";
    },replace("CanvasMasao","CanvasMasao_v28")))
    .pipe(gulp.dest("dist/"));
});

gulp.task('mc_canvas',['mc_canvas-static','mc_canvas-uglify'],function(){
    return gulp.src(["dist/CanvasMasao.js","dist/CanvasMasao_v28.js"])
    .pipe(concat("CanvasMasao.min.js"))
    .pipe(gulp.dest("dist/"));
});

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

gulp.task('default', ['jsx', 'static', 'mc_canvas']);
gulp.task('watch', ['watch-jsx', 'server'], ()=>{
    gulp.watch('html/*', ['html']);
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
      const watching = compiler.watch({
      }, (err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, true);
      });
  }else{
      compiler.run((err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, false);
      });
  }
}
