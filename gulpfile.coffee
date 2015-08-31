path = require 'path'
gulp = require 'gulp'
webpack = require 'webpack-stream'
connect = require 'gulp-connect'
typedoc = require 'gulp-typedoc'
mocha = require 'gulp-mocha'
gutil = require 'gulp-util'
haml = require 'gulp-haml'
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

# typedoc sources (Array), dest
typedocSrc = ['jThree/src/**/*.ts']
typedocDest = 'ci/docs'

# tsd file sources (Array)
tsdSrc = 'jThree/refs/**/*.d.ts'

# test target (Array)
testTarget = 'jThree/test/build/test.js'

# path to tsconfig.json
tsconfigPath = './tsconfig.json'

# pathes for webpack building
requireRoot = 'jThree/src'
serverRoot = 'jThree/wwwroot'
watchForReload = ['jThree/wwwroot/**/*.js', 'jThree/wwwroot/**/*.html', 'jThree/wwwroot/**/*.goml']

# individual config for webpack building
config =
  main:
    entry: 'jThree/src/jThree.ts'
    name: 'j3.js'
    dest: ['jThree/bin/product', 'jThree/wwwroot']
    watch: ['jThree/src/**/*.ts', 'jThree/refs/**/*.d.ts', 'jThree/src/**/*.glsl', 'jThree/src/**/*.json']

  test:
    entry: 'jThree/test/Test.ts'
    name: 'test.js'
    dest: ['jThree/test/build']
    watch: ['jThree/test/**/*.ts', 'jThree/refs/**/*.d.ts']

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


###
default task
###
gulp.task 'default', ['build']


###
build task
###
gulp.task 'build', ['webpack:main']

###
HAML Task
###
gulp.task 'haml', ->
    gulp
      .src "jThree/wwwroot/**/*.hgoml"
      .pipe haml 
        ext:".goml"
      .pipe gulp.dest "jThree/wwwroot/**"

###
webpack building task
###

Object.keys(config).forEach (suffix) ->
  c = config[suffix]
  gulp.task "webpack:#{suffix}", ->
    if watching && c.dest.length >= 2
      gulp.watch "#{c.dest[0]}/#{c.name}", ->
        copyFiles("#{c.dest[0]}/#{c.name}", c.dest[1..])
    gulp
      .src path.join __dirname, c.entry
      .pipe webpack
        watch: watching
        output:
          filename: c.name
        resolve:
          alias:
            'glm': 'gl-matrix'
          extensions: ['', '.js', '.ts']
          root: [requireRoot]
        module:
          loaders: [
              test: /\.json$/
              loader: 'json'
            ,
              test: /\.glsl$/
              loader: 'shader'
            ,
              test: /\.ts$/
              loader: 'ts-loader'
              configFileName: tsconfigPath
          ]
        glsl:
          chunkPath: "./Chunk"
      , null, (err, stats) ->
        gutil.log stats.toString defaultStatsOptions
        if stats.compilation.errors.length != 0
          gutil.log gutil.colors.black.bgYellow 'If tsconfig.json is not up-to-date, run command: "./node_modules/.bin/gulp --require coffee-script/register update-tsconfig-files"'
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
gulp.task 'watch:main', ['enable-watch-mode', 'webpack:main', 'server', 'watch-reload']

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
gulp.task 'travis', ['webpack:main'], ->


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
gulp.task 'test', ['webpack:test'], ->
  gulp.start ['mocha']


###
test watch task
###
gulp.task 'watch:test', ['enable-watch-mode', 'webpack:test', 'watch-mocha']

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
  json = JSON.parse fs.readFileSync path.join(__dirname, tsconfigPath)
  files = globArray.sync json.filesGlob
  json.files = _.uniq(files, true) # 2nd argu is 'isSorted'
  fs.writeFileSync path.join(__dirname, tsconfigPath), JSON.stringify(json, null, 2)

gulp.task 'tscfg', ['update-tsconfig-files']
