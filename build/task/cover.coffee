gulp = require 'gulp'
fs = require 'fs'
exec = require('child_process').execSync

class CoverTask
  getTaskNames: () =>
    ['cover:pre', 'cover', 'disable-sourcemap']

  dependentTask: (name, config) =>
    switch name
      when 'cover'
        return ['disable-sourcemap', 'cover:pre']
      when 'cover:pre'
        return ['build:main:ts']
      else
        return []

  task: (name, config) =>
    switch name
      when 'disable-sourcemap'
        config.entries.main.sourcemap = false;
      when 'cover'
        exec "#{path.resolve(process.cwd(), './node_modules/.bin/nyc')} --all --reporter=lcov --reporter=text \'#{path.resolve(process.cwd(), './node_modules/.bin/ava')} -v --require babel-register #{path.resolve(process.cwd(), './test/**/*Test.js')}\'"

module.exports = CoverTask
