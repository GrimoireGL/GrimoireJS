path = require 'path'
gulp = require 'gulp'
connect = require 'gulp-connect'
typedoc = require 'gulp-typedoc'
mocha = require 'gulp-mocha'
gutil = require 'gulp-util'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
watchify = require 'watchify'
browserify = require 'browserify'
sourcemaps = require 'gulp-sourcemaps'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
uglify = require 'gulp-uglify'
gulpif = require 'gulp-if'
shaderify = require 'shaderify'
txtify = require 'txtify'
jade = require 'gulp-jade'
fs = require 'fs'
_ = require 'lodash'
globArray = require 'glob-array'
del = require 'del'
args = require('yargs').argv
reactify = require 'coffee-reactify'
notifier = require 'node-notifier'
formatter = require 'pretty-hrtime'
runSequence = require 'run-sequence'
ts = require 'gulp-typescript'
cached = require 'gulp-cached'
tslint = require 'gulp-tslint'
mkdir = require 'mkdirp'
TaskManager = require './build/task-manager'
CleanTask = require './build/task/clean'
SampleTask = require './build/task/sample'
TsLintTask = require './build/task/tslint'
DocTask = require './build/task/doc'



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
  refsEntries:['./src/refs/**/*.ts']
  branch : args.branch || 'unknown'
  typedocSrc : ['./src/**/*.ts']
  typedocDest : 'ci/docs'

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

# path to tsconfig.json
tsconfigPath = './tsconfig.json'

# path to tsd.json
tsdPath = './tsd.json'

# root path for simple server
serverRoot = './wwwroot'

# ts compilcation config
tsEntries = ['./src/**/*.ts']
refsEntries = ['./src/refs/**/*.ts']
tsDest = './lib'
tsBase = './src'

# watch src for liveReload
watchForReload = ['./wwwroot/**/*.js', './wwwroot/**/*.html', './wwwroot/**/*.goml']
#
# # individual config for bundling
# config =
#   main:
#     entries: './lib/jThree.js'
#     name: 'j3.js'
#     extensions: ['.js', '.json', '.glsl', '.html','.xmml']
#     dest: ['./wwwroot', './bin/product']
#     target: 'web'
#     minify: false
#     transform: [
#       'shaderify'
#       'txtify'
#       {name: 'babelify', opt: {presets: 'es2015'}}
#       {name: 'envify', opt: {NODE_ENV: (if env_production then 'production' else 'development')}}
#     ]
#     detectGlobals: true
#   debug:
#     entries: './debug/debug.coffee'
#     name: 'j3-debug.js'
#     extensions: ['.json', '.coffee']
#     dest:['./wwwroot/debug']
#     target: 'web'
#     minify: false
#     transform: [
#       'coffee-reactify'
#       {name: 'envify', opt: {NODE_ENV: (if env_production then 'production' else 'development')}}
#     ]
#     detectGlobals: true


###
default task
###
gulp.task 'default', ['build']


###
build task
###
# gulp.task 'build', ['build:main', 'build:debug']
gulp.task 'build', ['build:main']

### TASK REGISTRATION###
TaskManager.register config,[
  CleanTask,
  SampleTask,
  TsLintTask,
  DocTask
]

###
main build task
###

buildSuccess = true

reporter = ts.reporter.defaultReporter()
reporter.error = (error) ->
  buildSuccess = false
  ts.reporter.defaultReporter().error error

tsProject = ts.createProject tsconfigPath, {noExternalResolve: true}

gulp.task 'build:main:ts', (done) ->
  c = config.main
  gulp
    .src tsEntries
    .pipe sourcemaps.init()
    .pipe ts tsProject, undefined, reporter
    .js
    .pipe cached
      title: "ts"
    .pipe sourcemaps.write()
    .pipe gulp.dest tsDest
    .on 'end', ->
      unless buildSuccess
        gutil.log gutil.colors.black.bgRed " [COMPILATION FAILED] (main) #{c.name} "
        process.exit 1 unless watching
      done()
  if watching
    gulp.watch tsEntries, ['build:main:ts']

gulp.task 'build:main:others', (done) ->
  c = config.main
  othersEntries = c
    .extensions
    .filter (v) -> v != '.js'
    .map (v) -> "#{tsBase}/**/*#{v}"
  gulp
    .src othersEntries
    .pipe cached
      title:"others"
    .pipe gulp.dest tsDest
    .on 'end', ->
      done()
  if watching
    gulp.watch othersEntries, ['build:main:others','build:main:ts']

gulp.task 'build:main', ->
  runSequence(['build:main:ts', 'build:main:others'], 'bundle:main');


###
debugger build task
###

gulp.task 'build:debug', ['bundle:debug']


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

Object.keys(config).forEach (suffix) ->
  c = config[suffix]
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
            process.exit 1 unless watching
          if buildSuccess && bundleSuccess
            notifier.notify
              message: "BUILD SUCCESS (#{suffix})"
              title: 'jThree'
          buildSuccess = true
          bundleSuccess = true
        .pipe source c.name
        .pipe buffer()
        .pipe sourcemaps.init
          loadMaps: true
        .pipe gulpif(!watching, gulpif(c.minify, uglify()))
        .pipe sourcemaps.write('./')
        .pipe gulp.dest(c.dest[0])
    if watching
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
  gulp.watch watchForReload, ['reload']

gulp.task 'watch:templete', ['watch:jade']

gulp.task 'watch:debug'

gulp.task 'watch', ['watch:main', 'watch:templete']


###
reload task
###
gulp.task 'reload', ->
  gulp
    .src watchForReload
    .pipe connect.reload()


###
server task
###
gulp.task 'server', ->
  connect.server
    root: serverRoot
    livereload: true

###
document generation task
###
# gulp.task 'doc', (cb) ->
#   gulp
#     .src typedocSrc
#     .pipe typedoc
#       target: 'es6'
#       out: path.join(typedocDest, branch)
#       name: 'jThree'
#       json: path.join(typedocDest, "#{branch}.json")


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


###
update tsconfig files (if your editor does not adapt to 'filesGlob')
###
gulp.task 'update-tsconfig-files', ->
  json = JSON.parse fs.readFileSync path.resolve(__dirname, tsconfigPath)
  files = _(globArray.sync(json.filesGlob)).uniq(true)
  json.files = files
  fs.writeFileSync path.resolve(__dirname, tsconfigPath), JSON.stringify(json, null, 2)

gulp.task 'tscfg', ['update-tsconfig-files']


# ###
# jade Task
# ###
# jadeCompile = (src, dest) ->
#   gutil.log("Jade Compiling " + gutil.colors.magenta(src.toString()))
#   gulp
#     .src src
#     .pipe jade
#       pretty: true
#     .pipe rename
#       extname: ".goml"
#     .pipe gulp.dest dest
#
# gulp.task 'jade', ->
#   jadeCompile path.join(templeteRoot, '**', "*#{jadeExtention}"), templeteRoot
#
# gulp.task 'watch:jade', ['jade'], ->
#   gulp.watch path.join(templeteRoot, '**', "*#{jadeExtention}"), (e) ->
#     jadeCompile e.path, path.dirname(e.path)

#
# gulp.task 'tslint', ->
#   ignoreEntries = [].concat refsEntries, ['./src/bundle-notdoc.ts']
#   gulp.src [].concat tsEntries, ignoreEntries.map((v) -> "!#{v}")
#     .pipe tslint
#       configuration: './tslint.json'
#     .pipe tslint.report 'verbose'
