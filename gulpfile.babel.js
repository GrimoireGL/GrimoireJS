import gulp from 'gulp';
import runSequence from 'run-sequence';
import ts from 'gulp-typescript';
import cache from 'gulp-cached';
import through from 'through2';
import gutil from 'gulp-util';
import del from 'del';
import sourcemap from 'gulp-sourcemaps';
// import debug from 'gulp-debug';

gulp.task('default', ['build']);

/**
 * build gr.js
 */
gulp.task('build', () => {
  runSequence(['ts-es6', 'txt-es6'], 'es6-es5', 'bundle');
});

/**
 * build gr.js
 */
gulp.task('build', () => {
  runSequence(['ts-es6', 'txt-es6'], 'es6-es5', 'bundle');
});

/**
 * Transpile ts to es6
 */
gulp.task('ts-es6', () => {
  return gulp
    .src('./src/**/*.ts')
    .pipe(sourcemap.init())
    .pipe(ts())
    .js
    .pipe(cache('ts'))
    .pipe(gulp.dest('./lib'));
});

/**
 * Expose text file to js modules
 */
gulp.task('txt-es6', () => {
  const txtEs6Extensions = ['.html', '.css', '.glsl', '.xmml', '.rsml', '.xml'];
  return gulp
    .src(txtEs6Extensions.map((ext) => `./src/**/*${ext}`))
    .pipe(cache('txt-es6'))
    .pipe((() => {
      return through.obj(function(f, e, cb) {
        if (f === null) {
          this.push(f);
          return cb();
        }
        if (f.isStream()) {
          this.emit('error', new gutil.PluginError('txt-js', 'file must be buffer.'));
          return cb();
        }
        const output = new gutil.File({
          cwd: f.cwd,
          base: f.base,
          path: gutil.replaceExtension(f.path, '.js'),
          contents: new Buffer(`export default ${JSON.stringify(f.contents.toString('utf8'))};`),
        });
        this.push(output);
        return cb();
      }, function(cb) { return cb(); });
    })())
    .pipe(gulp.dest('./lib'));
});

/**
 * Transpile es6 to es5
 */
gulp.task('es6-es5', () => {

});

/**
 * bundle with browserify
 */
gulp.task('bundle', () => {

});

/**
 * clean
 */
gulp.task('clean', () => {
  const temp = ['./product/gr.js', './product/gr.js.map', './src/**/*.js', './lib', './coverage', './ci'];
  del(temp).then((paths) => {
    paths.forEach((p) => gutil.log(`deleted: \"${p}\"`));
  });
});
