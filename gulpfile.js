var gulp = require("gulp");
var tsc=require('gulp-typescript');
var clean=require('gulp-clean');
var merge=require('merge2');
var concat=require('gulp-concat');
var sourcemaps=require('gulp-sourcemaps');
var using=require('gulp-using');
var webpack=require('gulp-webpack');
var ignore=require('gulp-ignore');
var watch=require('gulp-watch');
var connect=require('gulp-connect');
var minify=require('gulp-uglify');
var bower_files=['jQuery/dist/jquery.js'];
var bower_prefix='bower_components/';
/***********************************
* Typescript compile configuration**
************************************/
var tsProj=tsc.createProject({
  target:"ES5",
  module:"commonjs",
  declarationFiles:true,
  sourceRoot:"jThree/src/",
  noExternalResolve:true,
  noEmitOnError:true,
  typescript:require('typescript')
});

gulp.task('compile',function(){
  console.log('Typescript Compile Task');
  var tsResult=gulp.src(["jThree/src/**/*.ts"]).pipe(using({})).pipe(tsc(tsProj));
  return merge([
    tsResult.dts.pipe(gulp.dest('jThree/bin/def')),
    tsResult.js.pipe(gulp.dest('jThree/bin/js'))
  ]);
});

//Move bower files into build directory
gulp.task('move-refs',function(){
  for (var i = 0; i < bower_files.length; i++) {
    bower_files[i]=bower_prefix+bower_files[i];
  };
  gulp.src(bower_files).pipe(gulp.dest('jThree/bin/js'));
  gulp.src('jThree/src/static/**/*.*').pipe(gulp.dest('jThree/bin/js/static'))
});

gulp.task('webpack',['compile','move-refs'],function(){
  console.log('Webpack Task');
  // return gulp.src('jThree/bin/js/jThree.js').pipe(browserify({
  //         insertGlobals : true,
  //         shim:{
  //           jquery: {
  //               path: './jThree/bin/js/jquery.js',
  //               exports: 'jquery'
  //           }
  //         },
  //         basedir:'jThree/bin/js'
  //       })).pipe(gulp.dest('bin/product'));
  return gulp.src(['jThree/bin/js/**/*.js','jThree/bin/js/**/*.json','!jThree/bin/js/jThree.js'])
    .pipe(using({}))
    .pipe(webpack({
      entry:{
        jThree:'./jThree/bin/js/jThree.js'
      },
      output:{
        filename:'j3.js'
      },
      resolve:{
        alias:{
        'j3':'Core/JThreeContext.js',
      },
      root:'./jThree/bin/js'
    },
    module:{
      loaders:[
        {test:/\.json$/,loader:'json'}
      ]
    }
    }))
    .pipe(gulp.dest("jThree/bin/product")).pipe(connect.reload());
});

gulp.task('clean',function(){
  gulp.src("jThree/src/*.js").pipe(clean());
  gulp.src("jThree/src/*.js.map").pipe(clean());
  gulp.src("jThree/src/*/*.js").pipe(clean());
  gulp.src("jThree/src/*/*.js").pipe(clean());
  gulp.src("jThree/bin/js/*.*").pipe(clean());
  gulp.src("jThree/bin/def/*.*").pipe(clean());
});

gulp.task('watch',['server'],function()
{
  gulp.watch('jThree/src/**/*.ts',['build']);
  gulp.watch(['jThree/*.html','jThree/*.css','jThree/**/*.goml'],['reload']);

});

gulp.task('reload',function()
{
  gulp.src('jThree/**.*').pipe(connect.reload());
});

gulp.task('build',['webpack'],function(){
  gulp.src('jThree/bin/product/j3.js').pipe(gulp.dest('jThree/'));
});

gulp.task('minify',['build'],function(){
  return gulp.src('bin/product/j3.js').
    pipe(minify())
    .pipe(gulp.dest('jThree/bin/product/min'));
});

gulp.task('server',['build'],function(){
  connect.server({
    root:'./jThree',
    livereload:true
  });
});

gulp.task('travis',['build'],function(){

});
