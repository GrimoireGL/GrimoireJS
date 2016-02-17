path = require 'path'
gulp = require 'gulp'
args = require('yargs').argv
sourcemaps = require 'gulp-sourcemaps'
mocha = require 'gulp-mocha'
gutil = require 'gulp-util'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
watchify = require 'watchify'
browserify = require 'browserify'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
uglify = require 'gulp-uglify'
gulpif = require 'gulp-if'
shaderify = require 'shaderify'
txtify = require 'txtify'
jade = require 'gulp-jade'
fs = require 'fs'
_ = require 'lodash'
reactify = require 'coffee-reactify'
notifier = require 'node-notifier'
formatter = require 'pretty-hrtime'
ts = require 'gulp-typescript'
cached = require 'gulp-cached'
TaskManager = require './build/task-manager'
CleanTask = require './build/task/clean'
SampleTask = require './build/task/sample'
TsLintTask = require './build/task/tslint'
DocTask = require './build/task/doc'
TsConfig = require './build/task/tsconfig'
ServerTask = require './build/task/server'
BuildTask = require './build/task/build'
ReloadTask = require './build/task/reload'


###
TASK SUMMARY

* clean     clean directories
* build     build product
* server    start simple server
* watch     watch file tree and build, and start simple server with liveReload
* doc       construct document with typedoc
* test      run test
* tscfg     update tscofig.json by filesGlob in itself
###

config =
  entries:
    main:
      entries: './lib/jThree.js'
      name: 'j3.js'
      extensions: ['.js', '.json', '.glsl', '.html','.xmml']
      dest: ['./wwwroot', './bin/product']
      target: 'web'
      minify: false
      transform: [
        'shaderify'
        'txtify'
        {name: 'babelify', opt: {presets: 'es2015'}}
        {name: 'envify', opt: {NODE_ENV: (if env_production then 'production' else 'development')}}
      ]
      detectGlobals: true
    debug:
      entries: './debug/debug.coffee'
      name: 'j3-debug.js'
      extensions: ['.json', '.coffee']
      dest:['./wwwroot/debug']
      target: 'web'
      minify: false
      transform: [
        'coffee-reactify'
        {name: 'envify', opt: {NODE_ENV: (if env_production then 'production' else 'development')}}
      ]
      detectGlobals: true
  cleaner_files : ['./src/**/*.js']
  cleaner_files_silent : ['./lib/**/*']
  tsEntries:['./src/**/*.ts']
  tsDest:'./lib'
  tsBase:'./src'
  refsEntries:['./src/refs/**/*.ts']
  branch : args.branch || 'unknown'
  typedocSrc : ['./src/**/*.ts']
  typedocDest : 'ci/docs'
  tsconfigPath : './tsconfig.json'
  gulpDir:__dirname
  serverRoot : './wwwroot'
  watchForReload:['./wwwroot/**/*.js', './wwwroot/**/*.html', './wwwroot/**/*.goml']
  watching:false
  buildSuccess:true

config.tsProject = ts.createProject config.tsconfigPath, {noExternalResolve: true}

###
configure
###
# environment
env_production = false

gutil.log "branch: #{config.branch}"

# test target (Array)
testTarget = ['./test/**/*.js']

# templete convertion root (for entries of jade and haml)
templeteRoot = './wwwroot'

# # extention of jade
# jadeExtention = '.jdgoml'

# path to tsd.json
tsdPath = './tsd.json'

# root path for simple server

# ts compilcation config
tsEntries = ['./src/**/*.ts']
refsEntries = ['./src/refs/**/*.ts']
tsDest = './lib'




###
default task
###
gulp.task 'default', ['build']


### TASK REGISTRATION###
TaskManager.register config,[
  CleanTask,
  SampleTask,
  TsLintTask,
  DocTask,
  TsConfig,
  ServerTask,
  BuildTask,
  ReloadTask
]

###
bundling task
###

getBundler = (opt) ->
  if watching
    opt = _.merge opt, watchify.args
  b = browserify opt
  if watching
    b = watchify b, opt
  return b

###
debugger build task
###

bundleSuccess = true

Object.keys(config.entries).forEach (suffix) ->
  c = config.entries[suffix]
  gulp.task "bundle:#{suffix}", ->
    opt =
      entries: path.resolve(__dirname, c.entries)
      cache: {}
      packageCache: {}
      extensions: c.extensions
      debug: true
      detectGlobals: c.detectGlobals
      bundleExternal: c.target == 'web'
    b = getBundler opt
    c.transform.forEach (v) ->
      if _.isString v
        b = b.transform v
      else if _.isPlainObject v
        b = b.transform v.name, v.opt
    bundle = ->
      time = process.hrtime()
      gutil.log "Bundling... (#{suffix}) #{if watching then '(watch mode)' else ''}"
      b
        .bundle()
        .on 'error', (err) ->
          bundleSuccess = false
          gutil.log gutil.colors.black.bgRed " [BUNDLING FAILED] (#{suffix}) #{c.name} "
          gutil.log err.message
          @emit 'end'
        .on 'end', ->
          copyFiles(path.join(c.dest[0], c.name), c.dest[1..])
          copyFiles(path.join(c.dest[0], c.name + '.map'), c.dest[1..])
          if bundleSuccess
            taskTime = formatter process.hrtime time
            gutil.log(gutil.colors.black.bgGreen(" [BUNDLING SUCCESS] (#{suffix}) ") + gutil.colors.magenta(" #{taskTime}"))
          else
            process.exit 1 unless config.watching
          if config.buildSuccess && bundleSuccess
            notifier.notify
              message: "BUILD SUCCESS (#{suffix})"
              title: 'jThree'
          config.buildSuccess = true
          bundleSuccess = true
        .pipe source c.name
        .pipe buffer()
        .pipe sourcemaps.init
          loadMaps: true
        .pipe gulpif(!config.watching, gulpif(c.minify, uglify()))
        .pipe sourcemaps.write('./')
        .pipe gulp.dest(c.dest[0])
    if config.watching
      b.on 'update', bundle
    bundle()


###
copy files
###
copyFiles = (src, dest) ->
  for d in dest
    gulp
      .src src
      .pipe gulp.dest(d)


###
watch-mode
###
watching = false
gulp.task 'enable-watch-mode', -> watching = true


###
main watch task
###
# gulp.task 'watch:main', ['enable-watch-mode', 'build:debug', 'build:main', 'server', 'watch:reload']
gulp.task 'watch:main', ['enable-watch-mode', 'build:main', 'server', 'watch:reload']

gulp.task 'watch:reload', ->
  gulp.watch config.watchForReload, ['reload']

gulp.task 'watch', ['watch:main']

###
test task
###
gulp.task 'test', ['build:main'], ->
  gulp.start ['mocha']


###
test watch task
###
gulp.task 'watch:test', ['enable-watch-mode', 'build:main', 'watch-mocha']

gulp.task 'watch-mocha', ->
  gulp.watch testTarget, ['mocha']


###
mocha task
###
gulp.task 'mocha', ->
  require 'espower-babel/guess'
  gulp
    .src testTarget
    .pipe mocha()
