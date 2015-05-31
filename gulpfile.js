var bower_files, bower_prefix, coffee, combinePrefix, connect, destJs, gulp, merge, moveFromSrc, path, rimraf, srcFolder, tsSource, tsc, tscConfig, util, watch_build_file, watch_reload_file, webpack, webpack_exculde, webpack_files, webpack_src_root, wpcore;

gulp = require('gulp');

tsc = require('gulp-typescript');

merge = require('merge2');

coffee = require('gulp-coffee');

webpack = require('gulp-webpack');

wpcore = require('webpack');

connect = require('gulp-connect');

path = require('path');

util = require('util');

rimraf = require('rimraf');


/* compilation configuration for typescript */

tscConfig = tsc.createProject({
  target: "ES6",
  module: "commonjs",
  declarationFiles: true,
  sourceRoot: "jThree/src",
  noExternalResolve: false,
  noEmitOnError: true,
  noLib: false
});

srcFolder = 'jThree/src/';

destJs = 'jThree/bin/js/';

webpack_src_root = srcFolder;

webpack_files = ['**/*.json', '**/*.ts'];

webpack_exculde = ['jThree.js'];

bower_files = ['jquery/dist/jquery.js', 'jQuery/dist/jquery.js'];

tsSource = ['jThree/src/**/*.ts'];

watch_build_file = ['**/*.ts', '**/*.glsl'];

watch_reload_file = ['jThree/wwwroot/Example.js', 'jThree/wwwroot/Example.html', 'jThree/wwwroot/Example.gomml'];

bower_prefix = 'bower_components/';

moveFromSrc = function(s, d) {
  return gulp.src(srcFolder + s).pipe(gulp.dest(destJs + d));
};

combinePrefix = function(prefix, array) {
  var i, item, len, results;
  results = [];
  for (i = 0, len = array.length; i < len; i++) {
    item = array[i];
    results.push(prefix + item);
  }
  return results;
};


/*
Build order

compile    :The step for compiling typescript source code.
move       :The step for move files used by webpack
webpack    :The step to pack jthree modules.
 */

gulp.task('build', ['webpack'], function() {});

gulp.task('webpack-reload', ['webpack'], function() {
  return gulp.start(['reload']);
});


/* pack all jthree modules into one j3.js file. */

gulp.task('webpack', function() {
  var file, i, j, len, len1, webpack_src;
  webpack_src = [];
  for (i = 0, len = webpack_files.length; i < len; i++) {
    file = webpack_files[i];
    webpack_src.push(webpack_src_root + file);
  }
  for (j = 0, len1 = webpack_exculde.length; j < len1; j++) {
    file = webpack_exculde[j];
    webpack_src.push('!' + webpack_src_root + file);
  }
  return gulp.src(webpack_src).pipe(webpack({
    entry: {
      jThree: './jThree/src/JThree.ts'
    },
    output: {
      filename: 'j3.js'
    },
    resolve: {
      alias: {
        'jquery': path.join(__dirname, 'jquery.js')
      },
      extensions: ['', '.ts'],
      root: [webpack_src_root, path.join(__dirname, bower_prefix)],
      unsafeCache: true
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json'
        }, {
          test: /\.glsl$/,
          loader: 'shader'
        }, {
          test: /\.ts$/,
          loader: 'ts-loader',
          configFileName: 'jThree/tsconfig.json'
        }
      ]
    },
    glsl: {},
    cache: true,
    plugins: [new wpcore.ResolverPlugin(new wpcore.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))]
  })).pipe(gulp.dest('jThree/bin/product')).pipe(gulp.dest('jThree/wwwroot'));
});

gulp.task('compile', function() {
  var tsResult;
  console.log('typescript compile task');
  tsResult = gulp.src(tsSource).pipe(tsc(tscConfig));
  return merge([tsResult.dts.pipe(gulp.dest('jThree/bin/def')), tsResult.js.pipe(gulp.dest('jThree/bin/js'))]);
});

gulp.task('move-bower', function() {

  /*bower files */
  var inputs;
  inputs = combinePrefix(bower_prefix, bower_files);
  return gulp.src(inputs).pipe(gulp.dest(destJs)).pipe(gulp.dest('jThree/wwwroot'));
});

gulp.task('move-static', function() {
  return moveFromSrc('static/**/*.*', 'static/');
});

gulp.task('move-shader', function() {
  return moveFromSrc('Core/Shaders/**/*.*', 'Core/Shaders/');
});

gulp.task('move', function() {
  return gulp.start(['move-bower', 'move-static', 'move-shader']);
});


/*
watch task
 */

gulp.task('watch', ['server'], function() {
  gulp.watch(combinePrefix(srcFolder, watch_build_file), ['webpack-reload']);
  return gulp.watch(watch_reload_file, ['reload']);
});

gulp.task('reload', function() {
  return gulp.src("jThree/wwwroot/**/*.*").pipe(connect.reload());
});


/*
server task
 */

gulp.task('server', ['webpack'], function() {
  return connect.server({
    root: './jThree/wwwroot',
    livereload: true
  });
});


/*
travis task
 */

gulp.task('travis', ['webpack'], function() {});


/*
MISC
 */


/* the task for cleaning up */

gulp.task('clean', function(cb) {
  rimraf('jThree/bin', cb);
  return rimraf('jThree/src/**/*.js', cb);
});


/* the task for editing gulpfile.coffee */

gulp.task('gulp-edit', function() {
  return gulp.watch('gulpfile.coffee', ['gulp-compile']);
});

gulp.task('gulp-compile', function() {
  return gulp.src('gulpfile.coffee').pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./'));
});
