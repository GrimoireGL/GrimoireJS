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
envify = require 'envify/custom'
notifier = require 'node-notifier'
formatter = require 'pretty-hrtime'
runSequence = require 'run-sequence'
ts = require 'gulp-typescript'
changed = require 'gulp-changed'
tslint = require 'gulp-tslint'
mkdir = require 'mkdirp'

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


###
configure
###
branch = args.branch || 'unknown'
gutil.log "branch: #{branch}"

# typedoc sources (Array), dest
typedocSrc = ['./jThree/src/**/*.ts']
typedocDest = 'ci/docs'

# tsd file sources (Array)
tsdSrc = './jThree/refs/**/*.d.ts'

# test target (Array)
testTarget = './jThree/test/build/test.js'

# templete convertion root (for entries of jade and haml)
templeteRoot = 'jThree/wwwroot'

# extention of jade
jadeExtention = '.jdgoml'

# path to tsconfig.json
tsconfigPath = './tsconfig.json'

# path to bundle.ts for references
tsbundlePath = './jThree/src/bundle.ts'

# path to tsd.json
tsdPath = './tsd.json'

# root path for simple server
serverRoot = './jThree/wwwroot'

# webpack output stats config
defaultStatsOptions =
  colors: gutil.colors.supportsColor
  hash: false
  timings: true
  chunks: false
  chunkModules: false
  modules: false
  children: true
  version: true
  cached: false
  cachedAssets: false
  reasons: false
  source: false
  errorDetails: false

# ts compilcation config
tsEntries = './jThree/src/**/*.ts'
refsEntries = './jThree/src/refs/**/*.ts'
tsDest = './jThree/lib'
tsBase = './jThree/src'

# watch src for liveReload
watchForReload = ['./jThree/wwwroot/**/*.js', './jThree/wwwroot/**/*.html', './jThree/wwwroot/**/*.goml']

# individual config for bundling
config =
  main:
    entries: './jThree/lib/jThree.js'
    name: 'j3.js'
    extensions: ['.js', '.json', '.glsl', '.html','.xmml']
    dest: ['./jThree/wwwroot', './jThree/bin/product']
    target: 'web'
    minify: false
    transform: ['shaderify', 'txtify']
    detectGlobals: false
  debug:
    entries: './jThree/debug/debug.coffee'
    name: 'j3-debug.js'
    extensions: ['.json', '.coffee']
    dest:['./jThree/wwwroot/debug']
    target: 'web'
    minify: false
    transform: ['coffee-reactify']
    detectGlobals: true

# files for clean task
cleaner_files = ['./jThree/src/**/*.js']
cleaner_files_silent = ['./jThree/lib/**/*']

env_production = false

###
default task
###
gulp.task 'default', ['build']


###
build task
###
# gulp.task 'build', ['build:main', 'build:debug']
gulp.task 'build', ['build:main']

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
    .pipe changed tsDest
    .pipe sourcemaps.init()
    .pipe ts tsProject, undefined, reporter
    .js
    .pipe sourcemaps.write()
    .pipe gulp.dest tsDest
    .on 'end', ->
      unless buildSuccess
        gutil.log gutil.colors.black.bgRed " [COMPILATION FAILED] (main) #{c.name} "
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
    .pipe changed tsDest
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
      transform: c.transform
      detectGlobals: c.detectGlobals
      bundleExternal: c.target == 'web'
    b = getBundler opt
      .transform envify
        NODE_ENV: if env_production then 'production' else 'development'
    bundle = ->
      time = process.hrtime()
      gutil.log "Bundling... (#{suffix}) #{if watching then '(watch mode)' else ''}"
      b
        .bundle()
        .on 'error', (err) ->
          bundleSuccess = false
          gutil.log gutil.colors.black.bgRed " [BUNDLING FAILED] (#{suffix}) #{c.name} "
          gutil.log err.message
          console.log err
          @emit 'end'
        .on 'end', ->
          copyFiles(path.join(c.dest[0], c.name), c.dest[1..])
          copyFiles(path.join(c.dest[0], c.name + '.map'), c.dest[1..])
          if bundleSuccess
            taskTime = formatter process.hrtime time
            gutil.log(gutil.colors.black.bgGreen(" [BUNDLING SUCCESS] (#{suffix}) ") + gutil.colors.magenta(" #{taskTime}"))
          if buildSuccess && bundleSuccess
            notifier.notify({
              message: "BUILD SUCCESS (#{suffix})",
              title: 'jThree'
            });
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
travis task
###
gulp.task 'travis', ['build:main'], ->


###
document generation task
###
gulp.task 'doc', (cb) ->
  gulp
    .src [].concat typedocSrc, tsdSrc
    .pipe typedoc
      module: 'commonjs'
      target: 'es5'
      out: path.join(typedocDest, branch)
      name: 'jThree'
      json: path.join(typedocDest, "#{branch}.json")


###
test task
###
gulp.task 'test', ['build:test'], ->
  gulp.start ['mocha']


###
test watch task
###
gulp.task 'watch:test', ['enable-watch-mode', 'build:test', 'watch-mocha']

gulp.task 'watch-mocha', ->
  gulp.watch testTarget, ['mocha']


###
mocha task
###
gulp.task 'mocha', ->
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
  refs = _(files)
    .map (v) ->
      rpath = path.relative(path.dirname(tsbundlePath), v)
      if rpath != 'bundle.ts'
        "/// <reference path=\"#{rpath}\" />"
      else
        null
    .compact()
  fs.writeFileSync path.resolve(__dirname, tsbundlePath), (refs.join('\n') + '\n')

gulp.task 'tscfg', ['update-tsconfig-files']


###
jade Task
###
jadeCompile = (src, dest) ->
  gutil.log("Jade Compiling " + gutil.colors.magenta(src.toString()))
  gulp
    .src src
    .pipe jade
      pretty: true
    .pipe rename
      extname: ".goml"
    .pipe gulp.dest dest

gulp.task 'jade', ->
  jadeCompile path.join(templeteRoot, '**', "*#{jadeExtention}"), templeteRoot

gulp.task 'watch:jade', ['jade'], ->
  gulp.watch path.join(templeteRoot, '**', "*#{jadeExtention}"), (e) ->
    jadeCompile e.path, path.dirname(e.path)


###
clean directories task
###

gulp.task 'clean', ->
  del_entries = []
  Object.keys(config).forEach (k) ->
    c = config[k]
    c.dest.forEach (d) ->
      del_entries.push path.resolve(__dirname, d, c.name)
      del_entries.push path.resolve(__dirname, d, "#{c.name}.map")
  del_entries = del_entries.concat cleaner_files
  del_entries_silent = cleaner_files_silent
  del(del_entries).then (paths) ->
    paths.forEach (p) -> gutil.log "deleted: \"#{p}\""
  del(del_entries_silent)

gulp.task 'tslint', ->
  gulp.src [tsEntries,'!' + refsEntries,'!./jThree/src/bundle-notdoc.ts']
    .pipe tslint
      configuration:"./tslint.json"
    .pipe tslint.report "verbose"

gulp.task 'sample', ->
  sampleName = args.name
  debugDir = "./jThree/wwwroot/debug/";
  dirName =  debugDir  + "debugCodes/" + sampleName
  gomlPath = (dirName + "/" + sampleName + ".goml")
  jsPath = (dirName + "/" + sampleName + ".js")
  mkdir dirName,(err)=>
    if err
      console.error err
      return
    fs.createReadStream debugDir + "Template.goml"
      .pipe fs.createWriteStream gomlPath
    fs.createReadStream debugDir + "Template.js"
      .pipe fs.createWriteStream jsPath
    fs.readFile debugDir + "debug.json","utf-8",(err,data)=>
      jsonData = JSON.parse data
      jsonData.codes[sampleName] =
        goml: sampleName + "/" + sampleName + ".goml"
        js: [sampleName + "/" + sampleName + ".js"]
      fs.writeFile debugDir + "debug.json", JSON.stringify jsonData,null,4
