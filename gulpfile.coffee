path = require 'path'
gulp = require 'gulp'
args = require('yargs').argv
sourcemaps = require 'gulp-sourcemaps'
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
WatchTask = require './build/task/watch'
TestTask = require './build/task/test'
BundleTask = require './build/task/bundle'


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
  testTarget:['./test/**/*.js']
  bundleSuccess:true

config.tsProject = ts.createProject config.tsconfigPath, {noExternalResolve: true}

###
configure
###
# environment
env_production = false

gutil.log "branch: #{config.branch}"

# path to tsd.json
tsdPath = './tsd.json'


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
  ReloadTask,
  WatchTask,
  TestTask,
  BundleTask
]
