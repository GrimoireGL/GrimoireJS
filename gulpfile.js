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
var copy=require('gulp-copy');
var typedoc=require('gulp-typedoc');
var args=require('yargs').argv;
var bower_files=['jquery/dist/jquery.js','jQuery/dist/jquery.js'];
var bower_prefix='bower_components/';
var tsSourceTarget=['jThree/src/**/*.ts'];
var branchargs.branch||'unknown';
console.log('branch-name='+args.branch);
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
  var tsResult=gulp.src(tsSourceTarget).pipe(using({})).pipe(tsc(tsProj));
  return merge([
    tsResult.dts.pipe(gulp.dest('jThree/bin/def')),
    tsResult.js.pipe(gulp.dest('jThree/bin/js'))
  ]);
});


//Move bower files into build directory
gulp.task('move-bower',function(){
  for (var i = 0; i < bower_files.length; i++) {
    bower_files[i]=bower_prefix+bower_files[i];
  };
  return gulp.src(bower_files).pipe(using({})).pipe(gulp.dest("jThree/bin/js"));
});

gulp.task('move-static',function(){
  return gulp.src('jThree/src/static/**/*.*').pipe(gulp.dest("jThree/bin/js/static"));
});

gulp.task('make-modules',['compile','move-bower','move-static'],function(){

});

gulp.task('gen-doc',function(){
  gulp.src(tsSourceTarget).pipe(typedoc({
    module:'commonjs',
    out:'./jThree/docs',
    name:'jThree',
    target:'es5',
    includeDeclarations:true,
    json:'./jThree/docs/doc.json'
  }));
});

gulp.task('gen-doc-travis',function(){
  gulp.src(tsSourceTarget).pipe(typedoc({
    module:'commonjs',
    out:'./ci/docs/'+branch,
    name:'jThree',
    target:'es5',
    includeDeclarations:true,
    json:'./ci/docs/'+branch+'/doc.json'
  }));
});

gulp.task('webpack',['make-modules'],function(){
  console.log('Webpack Task');
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
        'jquery':'jquery.js'
      },
      root:'./jThree/bin/js'
    }
    ,
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
  gulp.src("jThree/src/**/*.js").pipe(clean());
  gulp.src("jThree/src/**/*.js").pipe(clean());
  gulp.src("jThree/bin/js/**/*.*").pipe(clean());
  gulp.src("jThree/bin/def/**/*.*").pipe(clean());
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

gulp.task('rebuild',['clean'],function(){
  gulp.start('build');
});
