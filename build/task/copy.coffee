gulp = require 'gulp'
args = require('yargs').argv

class Copy

  getTaskNames:(config)=>
    "copy"

  task:(name,config)=>
    throw new Error 'no src or dest' unless args.src && args.dest
    c = config.entries.main
    othersEntries = c
      .extensions
      .filter (v) -> v != '.js'
      .map (v) -> "#{args.src}/**/*#{v}"
    gulp
      .src othersEntries
      .pipe gulp.dest args.dest

module.exports = Copy
