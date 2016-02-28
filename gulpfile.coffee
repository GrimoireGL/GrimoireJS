args = require('yargs').argv
ts = require 'gulp-typescript'
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
CoverTask = require './build/task/cover'

env_production = false



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
        {name: 'babelify', opt: {presets: 'es2015',plugins:["transform-es2015-modules-commonjs","add-module-exports"]}}
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
  jsEntries:['./lib/**/*.js']
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
  BundleTask,
  CoverTask
]
