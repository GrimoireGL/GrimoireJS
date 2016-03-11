gulp = require 'gulp'
fs = require 'fs'
exec = require('child_process').execSync

class TestTask
  getTaskNames: () =>
    ['test']

  dependentTask: (name, config) =>
    switch name
      when 'test'
        return ['build:main']
      else
        return []

  task: (name, config) =>
    switch name
      when 'test'
        # gulp.start ['mocha']
        throw new Error "Deprecated command! Use 'npm run test' instead."
      when 'watch-mocha'
        # gulp.watch config.testTarget, ['mocha']
        throw new Error "Deprecated command! Use 'npm run test' instead."
      when 'mocha'
        throw new Error "Deprecated command! Use 'npm run test' instead."
        # @requireAsString ['.glsl','.html']
        # @requireAsJSON ['.json']
        # require 'espower-babel/guess'
        # gulp
        #   .src config.testTarget
        #   .pipe mocha()

module.exports = TestTask
