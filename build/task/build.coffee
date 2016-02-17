ts = require 'gulp-typescript'
sourcemaps = require 'gulp-sourcemaps'
gutil = require 'gulp-util'
cached = require 'gulp-cached'
gulp = require 'gulp'
runSequence = require 'run-sequence'


class Build

  reporter = ts.reporter.defaultReporter()

  onError:(error)=>
    @config.buildSuccess = false
    ts.reporter.defaultReporter().error error


  getTaskNames:(config)=>
    @config = config
    ["build:main:ts","build:main:others","build:debug","build:main","build"]

  dependentTask:(name,config)=>
    switch name
      when "build:main:ts"
        return []
      when "build:main:others"
        return []
      when "build:debug"
        return ["bundle:debug"]
      when "build:main"
        return [];
      when "build"
        return ["build:main","build:debug"]
      else
        console.error("Unknown build flags");

  task:(name,config,done)=>
    switch name
      when "build:main:ts"
        c = config.entries.main
        gulp
          .src config.tsEntries
          .pipe sourcemaps.init()
          .pipe ts config.tsProject, undefined, @reporter
          .js
          .pipe cached
            title: "ts"
          .pipe sourcemaps.write()
          .pipe gulp.dest config.tsDest
          .on 'end', ->
            unless config.buildSuccess
              gutil.log gutil.colors.black.bgRed " [COMPILATION FAILED] (main) #{c.name} "
              process.exit 1 unless config.watching
            done()
        if config.watching
          gulp.watch config.tsEntries, ['build:main:ts']
      when "build:main:others"
          c = config.entries.main
          othersEntries = c
            .extensions
            .filter (v) -> v != '.js'
            .map (v) -> "#{config.tsBase}/**/*#{v}"
          gulp
            .src othersEntries
            .pipe cached
              title:"others"
            .pipe gulp.dest config.tsDest
            .on 'end', ->
              done()
          if config.watching
            gulp.watch othersEntries, ['build:main:others','build:main:ts']
        when "build:main"
            return runSequence(['build:main:ts', 'build:main:others'], 'bundle:main',done);


module.exports = Build
