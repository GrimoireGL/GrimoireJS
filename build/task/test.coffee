gulp = require 'gulp'
mocha = require 'gulp-mocha'
runSequence = require 'run-sequence'
fs = require('fs')
class TestTask

  requireAsString:(exts)=>
    exts.forEach (ext) =>
      require.extensions[ext] = (module, filename)=>
        module.exports = fs.readFileSync filename, 'utf8'

  requireAsJSON:(exts)=>
    exts.forEach (ext) =>
      require.extensions[ext] = (module, filename)=>
        module.exports = JSON.parse(fs.readFileSync filename, 'utf8')


  getTaskNames:()=>
    ['mocha','test','watch-mocha']

  dependentTask:(name,config)=>
    switch name
      when 'test'
        return ['build:main']
      else
        return []

  task:(name,config)=>
    switch name
      when 'test'
        @requireAsString ['.glsl','.html']
        @requireAsJSON ['.json']
        gulp.start ['mocha']
      when 'watch-mocha'
        gulp.watch config.testTarget, ['mocha']
      when 'mocha'
        require 'espower-babel/guess'
        gulp
          .src config.testTarget
          .pipe mocha()
module.exports = TestTask
