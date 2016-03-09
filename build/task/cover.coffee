gulp = require 'gulp'
fs = require 'fs'
exec = require('child_process').execSync

class CoverTask
  getTaskNames: () =>
    ['cover:pre', 'cover']

  dependentTask: (name, config) =>
    switch name
      when 'cover'
        return ['cover:pre']
      when 'cover:pre'
        config.entries.main.sourcemap = false;
        return ['build:main:ts']
      else
        return []

  task: (name, config) =>
    switch name
      when 'cover'
        exec "#{path.resolve(process.cwd(), './node_modules/.bin/nyc')} --all --reporter=lcov --reporter=text \'#{path.resolve(process.cwd(), './node_modules/.bin/ava')} -v --require babel-register #{path.resolve(process.cwd(), './test/**/*Test.js')}\'"

module.exports = CoverTask
