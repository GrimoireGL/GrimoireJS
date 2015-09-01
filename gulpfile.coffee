path = require 'path'
gulp = require 'gulp'
webpack = require 'webpack-stream'
connect = require 'gulp-connect'
typedoc = require 'gulp-typedoc'
mocha = require 'gulp-mocha'
gutil = require 'gulp-util'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
watchify = require 'gulp-watchify'
tsify = require 'tsify'
shaderify = require '../shaderify/lib/shaderify'
fs = require 'fs'
_ = require 'lodash'
globArray = require 'glob-array'
args = require('yargs').argv


###
TASK SUMMARY

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
tsEntries = ["./jThree/**/*.ts", "./test/**/*.ts"]

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

# pathes for webpack building
requireRoot = './jThree/src'

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

# alias for resolving require
requireAliases =
  'glm': 'gl-matrix'

# individual config for build
config =
  main:
    bundler: 'webpack'
    entry: './jThree/src/jThree.ts'
    name: 'j3.js'
    dest: ['./jThree/bin/product', './jThree/wwwroot']
    target: 'web'

  test:
    bundler: 'browserify'
    entry: './jThree/test/Test.coffee'
    name: 'test.js'
    dest: ['./jThree/test/build']
    target: 'node'

###
default task
###
gulp.task 'default', ['build']


###
build task
###
gulp.task 'build', ['build:main']


###
webpack building task
###

Object.keys(config).forEach (suffix) ->
  c = config[suffix]
  bundler = forceBundler || c.bundler
  gulp.task "build:#{suffix}", do ->
    if bundler == 'webpack'
      return ->
        if watching && c.dest.length >= 2
          gulp.watch "#{c.dest[0]}/#{c.name}", ->
            copyFiles("#{c.dest[0]}/#{c.name}", c.dest[1..])
        gulp
          .src path.resolve __dirname, c.entry
          .pipe webpack
            watch: watching
            output:
              filename: c.name
            resolve:
              alias:
                'glm': 'gl-matrix'
              extensions: ['', '.js', '.json', '.ts', '.coffee', '.glsl']
              root: requireRoot
            module:
              loaders: [
                  test: /\.json$/
                  loader: 'json-loader'
                ,
                  test: /\.ts$/
                  loader: 'ts-loader'
                  configFileName: tsconfigPath
                ,
                  test: /\.coffee$/
                  loader: 'coffee-loader'
                ,
                  test: /\.glsl$/
                  loader: 'shader-loader'
              ]
            target: c.target
            glsl:
              chunkPath: "./Chunk"
          , null, (err, stats) ->
            gutil.log stats.toString defaultStatsOptions
            if stats.compilation.errors.length != 0
              gutil.log gutil.colors.black.bgYellow 'If tsconfig.json is not up-to-date, run command: "./   node_modules/.bin/gulp --require coffee-script/register update-tsconfig-files"'
          .pipe gulp.dest(c.dest[0])
          .on 'end', ->
            unless watching
              copyFiles("#{c.dest[0]}/#{c.name}", c.dest[1..])
    else if bundler == 'browserify'
      # tsdBundlePath = JSON.parse(fs.readFileSync(tsdPath))?.bundle
      return watchify (watchify) ->
        if watching && c.dest.length >= 2
          gulp.watch "#{c.dest[0]}/#{c.name}", ->
            copyFiles("#{c.dest[0]}/#{c.name}", c.dest[1..])
        gulp
          .src path.resolve(__dirname, c.entry)
          .pipe plumber()
          .pipe watchify
            watch: watching
            extensions: ['', '.js', '.json', '.ts', '.coffee', '.glsl']
            # debug: true
            transform: ['coffeeify']
            detectGlobals: c.target == 'node'
            bundleExternal: c.target == 'web'
            setup: (b) ->
              b.transform shaderify
              b.plugin tsify, {target: "es5"}
          .pipe rename(c.name)
          .pipe gulp.dest(c.dest[0])
          .on 'end', ->
            unless watching
              copyFiles("#{c.dest[0]}/#{c.name}", c.dest[1..])


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
gulp.task 'watch:main', ['enable-watch-mode', 'build:main', 'server', 'watch-reload']

gulp.task 'watch-reload', ->
  gulp.watch watchForReload, ['reload']

gulp.task 'watch', ['watch:main']


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
      out: "#{typedocDest}/#{branch}"
      name: 'jThree'
      json: "#{typedocDest}/#{branch}.json"


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
