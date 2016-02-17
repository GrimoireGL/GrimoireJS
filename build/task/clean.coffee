path = require 'path'
del = require 'del'
class Clean

  getTaskNames:()=>
    "clean"

  task:(name,config)=>
    del_entries = []
    c = config.entries['main']
    c.dest.forEach (d) ->
      del_entries.push path.resolve(__dirname, d, c.name)
      del_entries.push path.resolve(__dirname, d, "#{c.name}.map")
    del_entries = del_entries.concat config.cleaner_files
    del_entries_silent = config.cleaner_files_silent
    del(del_entries).then (paths) ->
      paths.forEach (p) -> gutil.log "deleted: \"#{p}\""
    del(del_entries_silent)

module.exports = Clean
