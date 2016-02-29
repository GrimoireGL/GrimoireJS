connect = require 'gulp-connect'
class Server

  getTaskNames:(config)=>
    'server'

  task:(name,config)=>
    connect.server
      root: config.serverRoot
      livereload: true
      fallback:"index.html"

module.exports = Server
