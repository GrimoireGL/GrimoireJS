gulp = require 'gulp'
class Watch

  getTaskNames:()=>
    ['watch','watch:main','watch:reload','watch:test','watch:enable','default']

  dependentTask:(name,config)=>
    switch name
      when 'watch'
        return ['watch:main']
      when 'watch:main'
        return ['watch:enable', 'build:main', 'server', 'watch:reload']
      when 'watch:test'
        return ['watch:enable', 'build:main', 'watch-mocha']
      when 'default'
        return ['watch:main']
      else
        return []

  task:(name,config)=>
    switch name
      when 'watch:reload'
        gulp.watch config.watchForReload, ['reload']
      when 'watch:enable'
        config.watching = true

module.exports = Watch
