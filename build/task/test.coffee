gulp = require 'gulp'
mocha = require 'gulp-mocha'
runSequence = require 'run-sequence'

class TestTask

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
        gulp.start ['mocha']
      when 'watch-mocha'
        gulp.watch config.testTarget, ['mocha']
      when 'mocha'
        require 'espower-babel/guess'
        gulp
          .src config.testTarget
          .pipe mocha()

module.exports = TestTask
