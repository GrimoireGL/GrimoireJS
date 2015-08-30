(function() {
  var _, args, branch, config, connect, copyFiles, defaultStatsOptions, fs, globArray, gulp, gutil, haml, mocha, path, requireRoot, serverRoot, testTarget, tsconfigPath, tsdSrc, typedoc, typedocDest, typedocSrc, watchForReload, watching, webpack;

  path = require('path');

  gulp = require('gulp');

  webpack = require('webpack-stream');

  connect = require('gulp-connect');

  typedoc = require('gulp-typedoc');

  mocha = require('gulp-mocha');

  gutil = require('gulp-util');

  haml = require('gulp-haml');

  fs = require('fs');

  _ = require('lodash');

  globArray = require('glob-array');

  args = require('yargs').argv;


  /*
  TASK SUMMARY
  
  * build     build product
  * server    start simple server
  * watch     watch file tree and build, and start simple server with liveReload
  * doc       construct document with typedoc
  * test      run test
  * tscfg     update tscofig.json by filesGlob in itself
   */


  /*
  configure
   */

  branch = args.branch || 'unknown';

  gutil.log("branch: " + branch);

  typedocSrc = ['jThree/src/**/*.ts'];

  typedocDest = 'ci/docs';

  tsdSrc = 'jThree/refs/**/*.d.ts';

  testTarget = 'jThree/test/build/test.js';

  tsconfigPath = './tsconfig.json';

  requireRoot = 'jThree/src';

  serverRoot = 'jThree/wwwroot';

  watchForReload = ['jThree/wwwroot/**/*.js', 'jThree/wwwroot/**/*.html', 'jThree/wwwroot/**/*.goml'];

  config = {
    main: {
      entry: 'jThree/src/jThree.ts',
      name: 'j3.js',
      dest: ['jThree/bin/product', 'jThree/wwwroot'],
      watch: ['jThree/src/**/*.ts', 'jThree/refs/**/*.d.ts', 'jThree/src/**/*.glsl', 'jThree/src/**/*.json']
    },
    test: {
      entry: 'jThree/test/Test.ts',
      name: 'test.js',
      dest: ['jThree/test/build'],
      watch: ['jThree/test/**/*.ts', 'jThree/refs/**/*.d.ts']
    }
  };

  defaultStatsOptions = {
    colors: gutil.colors.supportsColor,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: true,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false
  };


  /*
  default task
   */

  gulp.task('default', ['build']);


  /*
  build task
   */

  gulp.task('build', ['webpack:main']);


  /*
  HAML Task
   */

  gulp.task('haml', function() {
    return gulp.src("jThree/wwwroot/**/*.hgoml").pipe(haml({
      ext: ".goml"
    })).pipe(gulp.dest("jThree/wwwroot/**"));
  });


  /*
  webpack building task
   */

  Object.keys(config).forEach(function(suffix) {
    var c;
    c = config[suffix];
    return gulp.task("webpack:" + suffix, function() {
      if (watching && c.dest.length >= 2) {
        gulp.watch(c.dest[0] + "/" + c.name, function() {
          return copyFiles(c.dest[0] + "/" + c.name, c.dest.slice(1));
        });
      }
      return gulp.src(path.join(__dirname, c.entry)).pipe(webpack({
        watch: watching,
        output: {
          filename: c.name
        },
        resolve: {
          alias: {
            'glm': 'gl-matrix'
          },
          extensions: ['', '.js', '.ts'],
          root: [requireRoot]
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
              configFileName: tsconfigPath
            }
          ]
        },
        glsl: {
          chunkPath: "./Chunk"
        }
      }, null, function(err, stats) {
        gutil.log(stats.toString(defaultStatsOptions));
        if (stats.compilation.errors.length !== 0) {
          return gutil.log(gutil.colors.black.bgYellow('If tsconfig.json is not up-to-date, run command: "./node_modules/.bin/gulp --require coffee-script/register update-tsconfig-files"'));
        }
      })).pipe(gulp.dest(c.dest[0])).on('end', function() {
        if (!watching) {
          return copyFiles(c.dest[0] + "/" + c.name, c.dest.slice(1));
        }
      });
    });
  });


  /*
  copy files
   */

  copyFiles = function(src, dest) {
    var d, i, len, results;
    results = [];
    for (i = 0, len = dest.length; i < len; i++) {
      d = dest[i];
      results.push(gulp.src(src).pipe(gulp.dest(d)));
    }
    return results;
  };


  /*
  watch-mode
   */

  watching = false;

  gulp.task('enable-watch-mode', function() {
    return watching = true;
  });


  /*
  main watch task
   */

  gulp.task('watch:main', ['enable-watch-mode', 'webpack:main', 'server', 'watch-reload']);

  gulp.task('watch-reload', function() {
    return gulp.watch(watchForReload, ['reload']);
  });

  gulp.task('watch', ['watch:main']);


  /*
  reload task
   */

  gulp.task('reload', function() {
    return gulp.src(watchForReload).pipe(connect.reload());
  });


  /*
  server task
   */

  gulp.task('server', function() {
    return connect.server({
      root: serverRoot,
      livereload: true
    });
  });


  /*
  travis task
   */

  gulp.task('travis', ['webpack:main'], function() {});


  /*
  document generation task
   */

  gulp.task('doc', function(cb) {
    return gulp.src([].concat(typedocSrc, tsdSrc)).pipe(typedoc({
      module: 'commonjs',
      target: 'es5',
      out: typedocDest + "/" + branch,
      name: 'jThree',
      json: typedocDest + "/" + branch + ".json"
    }));
  });


  /*
  test task
   */

  gulp.task('test', ['webpack:test'], function() {
    return gulp.start(['mocha']);
  });


  /*
  test watch task
   */

  gulp.task('watch:test', ['enable-watch-mode', 'webpack:test', 'watch-mocha']);

  gulp.task('watch-mocha', function() {
    return gulp.watch(testTarget, ['mocha']);
  });


  /*
  mocha task
   */

  gulp.task('mocha', function() {
    return gulp.src(testTarget).pipe(mocha());
  });


  /*
  update tsconfig files (if your editor does not adapt to 'filesGlob')
   */

  gulp.task('update-tsconfig-files', function() {
    var files, json;
    json = JSON.parse(fs.readFileSync(path.join(__dirname, tsconfigPath)));
    files = globArray.sync(json.filesGlob);
    json.files = _.uniq(files, true);
    return fs.writeFileSync(path.join(__dirname, tsconfigPath), JSON.stringify(json, null, 2));
  });

  gulp.task('tscfg', ['update-tsconfig-files']);

}).call(this);

//# sourceMappingURL=gulpfile.js.map
