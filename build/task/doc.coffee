path = require 'path'
gulp = require 'gulp'
typedoc = require 'gulp-typedoc'
class DocumentGenerator

  getTaskNames:()=>
    "doc"

  task:(name,config)=>
    gulp
      .src config.typedocSrc
      .pipe typedoc
        target: 'es6'
        out: path.join(config.typedocDest, config.branch)
        name: 'jThree'
        json: path.join(config.typedocDest, "#{config.branch}.json")


module.exports = DocumentGenerator;
