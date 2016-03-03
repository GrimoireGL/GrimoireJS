gulp = require 'gulp'
istanbul = require 'gulp-istanbul'
babel = require 'gulp-babel'
mocha = require 'gulp-mocha'
fs = require 'fs'
class CoverTask
  requireAsString:(exts)=>
    exts.forEach (ext) =>
      require.extensions[ext] = (module, filename)=>
        console.log 'requireing ' + filename
        module.exports = fs.readFileSync filename, 'utf8'

  requireAsJSON:(exts)=>
    exts.forEach (ext) =>
      require.extensions[ext] = (module, filename)=>
        console.log 'requireing ' + filename
        module.exports = JSON.parse(fs.readFileSync filename, 'utf8')

  getTaskNames:()=>
    ['cover:pre:babel:core','cover:pre:babel:test','cover:pre:other','cover:pre','cover','ci:cover']

  dependentTask:(name,config)=>
    switch name
      when 'cover:pre:babel:core'
        return ['build:main']
      when 'cover:pre'
        return ['cover:pre:babel:core','cover:pre:babel:test','cover:pre:other']
      when 'cover'
        return ['cover:pre']
      when 'ci:cover'
        return ['cover']
      else
        return []

  task:(name,config)=>
    switch name
      when 'cover:pre:babel:core'
        gulp.src ['./lib/**/*.js']
          .pipe babel
            presets:["es2015"]
          .pipe gulp.dest('lib/')
      when 'cover:pre:babel:test'
        gulp.src ['./test/**/*.js']
          .pipe babel
            presets:["es2015"]
          .pipe gulp.dest('lib-test/')
      when 'cover:pre:other'
        gulp.src ['./test/**/*.*','!./test/**/*.js']
          .pipe gulp.dest('lib-test/')
      when 'cover:pre'
        gulp.src ['lib/**/*.js']
          .pipe istanbul
            includeUntested:true
          .pipe istanbul.hookRequire()
      when 'cover'
        @requireAsString ['.glsl','.html']
        @requireAsJSON ['.json']
        gulp.src ['lib-test/**/*.js']
          .pipe mocha()
          .pipe istanbul.writeReports()
      when 'ci:cover'
        gulp.src ['coverage/**/*.*']
          .pipe gulp.dest 'ci/cover/'+config.branch

module.exports = CoverTask
