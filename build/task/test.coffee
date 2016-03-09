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
        exec "#{path.resolve(process.cwd(), './node_modules/.bin/ava'))} -v --require babel-register path.resolve(process.cwd(), './test/**/*Test.js'))}"

module.exports = TestTask
