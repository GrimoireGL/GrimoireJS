tslint = require 'gulp-tslint'
gulp = require 'gulp'
class TsLint

  getTaskNames:(config)=>
    "lint:ts"

  task:(name,config)=>
    ignoreEntries = [].concat config.refsEntries, ['./src/bundle-notdoc.ts']
    gulp.src [].concat config.tsEntries, ignoreEntries.map((v) -> "!#{v}")
      .pipe tslint
        configuration: './tslint.json'
      .pipe tslint.report 'verbose'

module.exports = TsLint
