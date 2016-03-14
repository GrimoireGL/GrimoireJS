path = require 'path'
gutil = require 'gulp-util'
formatter = require 'pretty-hrtime'
uglify = require 'gulp-uglify'
notifier = require 'node-notifier'
_ = require 'lodash'
buffer = require 'vinyl-buffer'
browserify = require 'browserify'
watchify = require 'watchify'
gulp = require 'gulp'
source = require 'vinyl-source-stream'
sourcemaps = require 'gulp-sourcemaps'
gulpif = require 'gulp-if'
shaderify = require 'shaderify'
txtify = require 'txtify'



class Bundle
  copyFiles:(src, dest) ->
    for d in dest
      gulp
        .src src
        .pipe gulp.dest(d)

  getBundler:(config,opt) ->
    if config.watching
      opt = _.merge opt, watchify.args
    b = browserify opt
    if config.watching
      b = watchify b, opt
    b

  getTaskNames:(config)=>
    Object.keys(config.entries).map((v)=>"bundle:#{v}")

  task:(name,config)=>
    splitted = name.split ":"
    bundleType = splitted[1]
    c = config.entries[bundleType]
    opt =
      entries: path.resolve(config.gulpDir, c.entries)
      cache: {}
      packageCache: {}
      extensions: c.extensions
      debug: true
      detectGlobals: c.detectGlobals
      bundleExternal: c.target == 'web'
    b = @getBundler config,opt
    c.transform.forEach (v) ->
      if _.isString v
        b = b.transform v
      else if _.isPlainObject v
        b = b.transform v.name, v.opt
    bundle = =>
      time = process.hrtime()
      gutil.log "Bundling... (#{bundleType}) #{if config.watching then '(watch mode)' else ''}"
      b
        .bundle()
        .on 'error', (err) ->
          config.bundleSuccess = false
          gutil.log gutil.colors.black.bgRed " [BUNDLING FAILED] (#{bundleType}) #{c.name} "
          gutil.log err.message
          @emit 'end'
        .on 'end', ()=>
          @copyFiles(path.join(c.dest[0], c.name), c.dest[1..])
          @copyFiles(path.join(c.dest[0], c.name + '.map'), c.dest[1..])
          if config.bundleSuccess
            taskTime = formatter process.hrtime time
            gutil.log(gutil.colors.black.bgGreen(" [BUNDLING SUCCESS] (#{bundleType}) ") + gutil.colors.magenta(" #{taskTime}"))
          else
            process.exit 1 unless config.watching
          if config.buildSuccess && config.bundleSuccess
            notifier.notify
              message: "BUILD SUCCESS (#{bundleType})"
              title: 'jThree'
          config.buildSuccess = true
          config.bundleSuccess = true
        .pipe source c.name
        .pipe buffer()
        .pipe sourcemaps.init
          loadMaps: true
        .pipe gulpif(!config.watching, gulpif(c.minify, uglify()))
        .pipe gulpif(c.sourcemap, sourcemaps.write('./'))
        .pipe gulp.dest(c.dest[0])
    if config.watching
      b.on 'update', bundle
    bundle()

module.exports = Bundle
