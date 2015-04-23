var gulp = require("gulp");
var tsc=require('gulp-typescript');
var merge=require('merge2');
/***********************************
* Typescript compile configuration**
************************************/
var tsProj=tsc.createProject({
  target:"ES5",
  module:"amd",
  declarationFiles:true,
});

gulp.task('default',function() {
    //compile typescript files
    var tsResult=gulp.src("jThree/src/jThree.ts").pipe(tsc(tsProj));

    return merge([
      tsResult.dts.pipe(gulp.dest('jThree/bin/def')),
      tsResult.js.pipe(gulp.dest('jThree/bin/js'))
    ]);
});
