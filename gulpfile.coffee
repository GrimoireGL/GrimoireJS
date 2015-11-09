path = require 'path'
gulp = require 'gulp'
connect = require 'gulp-connect'
typedoc = require 'gulp-typedoc'
mocha = require 'gulp-mocha'
gutil = require 'gulp-util'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
watchify = require 'gulp-watchify'
sourcemaps = require 'gulp-sourcemaps'
buffer = require 'vinyl-buffer'
uglify = require 'gulp-uglify'
gulpif = require 'gulp-if'
tsify = require 'tsify'
shaderify = require 'shaderify'
jade = require 'gulp-jade'
fs = require 'fs'
_ = require 'lodash'
globArray = require 'glob-array'
del = require 'del'
args = require('yargs').argv
reactify = require 'coffee-reactify'
envify = require 'envify/custom'

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

forceBundler = args.bundler || null
gutil.log "force compile with bundler: #{forceBundler}" if forceBundler?

# typedoc sources (Array), dest
typedocSrc = ['./jThree/src/**/*.ts']
typedocDest = 'ci/docs'

# tsd file sources (Array)
tsdSrc = './jThree/refs/**/*.d.ts'

# test target (Array)
testTarget = './jThree/test/build/test.js'

# entries of ts files (same as tsconfig files)
tsEntries = ['./jThree/**/*.ts', './test/**/*.ts']

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

# watch src for liveReload
watchForReload = ['./jThree/wwwroot/**/*.js', './jThree/wwwroot/**/*.html', './jThree/wwwroot/**/*.goml']

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

# individual config for build
config =
  main:
    entry: './jThree/src/jThree.ts'
    name: 'j3.js'
    dest: ['./jThree/bin/product', './jThree/wwwroot']
    target: 'web'
    minify: false
    transform:'coffeeify'
    detectGlobals:false
  debug:
    entry: './jThree/debug/debug.coffee'
    name: 'j3-debug.js'
    dest:['./jThree/wwwroot/debug']
    target: 'web'
    minify:false
    transform:'coffee-reactify'
    detectGlobals:true
  test:
    entry: './jThree/test/Test.coffee'
    name: 'test.js'
    dest: ['./jThree/test/build']
    target: 'node'
    minify: false
    transform:'coffeeify'
    detectGlobals:false

# files for clean task
cleaner_files = ['./jThree/src/**/*.js']

env_production = false

###
default task
###
gulp.task 'default', ['build']


###
build task
###
gulp.task 'build', ['build:main']


###
building task
###

Object.keys(config).forEach (suffix) ->
  c = config[suffix]
  bundler = forceBundler || c.bundler
  gulp.task "build:#{suffix}", do ->
      # tsdBundlePath = JSON.parse(fs.readFileSync(tsdPath))?.bundle
      return watchify (watchify) ->
        gulp
          .src path.resolve(__dirname, c.entry)
          .pipe plumber()
          .pipe watchify
            watch: watching
            extensions: ['', '.js', '.json', '.ts', '.coffee', '.glsl']
            debug: true
            transform: [c.transform]
            detectGlobals: c.detectGlobals
            bundleExternal: c.target == 'web'
            setup: (b) ->
              b.transform shaderify
              b.plugin tsify, {target: "es5"}
              b.transform envify
                NODE_ENV: if env_production then 'production' else 'development'
          .pipe buffer()
          .pipe sourcemaps.init
            loadMaps: true
          .pipe gulpif(!watching, gulpif(c.minify, uglify()))
          .pipe rename(c.name)
          .pipe sourcemaps.write('./')
          .pipe gulp.dest(c.dest[0])
          .on 'end', ->
            copyFiles(path.join(c.dest[0], c.name), c.dest[1..])
            copyFiles(path.join(c.dest[0], c.name + '.map'), c.dest[1..])
          .on 'error', ->
            gutil.log gutil.colors.black.bgYellow 'If tsconfig.json is not up-to-date, run command: "./   node_modules/.bin/gulp --require coffee-script/register update-tsconfig-files"'


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
gulp.task 'watch:main', ['enable-watch-mode','build:debug', 'build:main','server', 'watch:reload']

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
  del(del_entries).then (paths) ->
    paths.forEach (p) -> gutil.log "deleted: \"#{p}\""
