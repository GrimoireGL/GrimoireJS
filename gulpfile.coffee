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
CopyTask = require './build/task/copy'
fs = require 'fs'
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
      extensions: ['.js', '.json', '.glsl', '.html','.xmml','.rsml','.xml']
      dest: ['./wwwroot', './bin/product']
      target: 'web'
      minify: false
      sourcemap: !args.nosourcemap
      transform: [
        {name:'txtify', opt: {extensions: ['.json','.html','.css','.glsl','.xmml','.rsml','.xml']}}
        {name: 'babelify'}
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
      sourcemap: !args.nosourcemap
      transform: [
        'coffee-reactify'
        {name: 'envify', opt: {NODE_ENV: (if env_production then 'production' else 'development')}}
      ]
      detectGlobals: true
  cleaner_files : ['./src/**/*.js']
  cleaner_files_silent : ['./lib', './lib-es6', './test-es5', './coverage', './ci']
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
  CoverTask,
  CopyTask,
]


# When there was no debug.json in wwwroot folder, debug.json will be generated
fs.open "wwwroot/debug/debug.json","ax+",384,(err,fd)=>
  if !err
    # Assume the file was not existing
    fs.createReadStream 'wwwroot/debug/debug.json.template'
      .pipe fs.createWriteStream('wwwroot/debug/debug.json');
  else
    fd && fs.close fd, (err)=>
      undefined
