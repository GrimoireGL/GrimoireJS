gulp = require 'gulp'
connect = require 'gulp-connect'

class Reload

  getTaskNames:()=>
    'reload'

  task:(name,config)=>
    gulp
      .src config.watchForReload
      .pipe connect.reload()

module.exports = Reload
