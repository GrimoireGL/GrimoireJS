path = require 'path'
gulp = require 'gulp'
webpack = require 'webpack-stream'
connect = require 'gulp-connect'
typedoc = require 'gulp-typedoc'
mocha = require 'gulp-mocha'
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
console.log "branch: #{branch}"

requireRoot = 'jThree/src'
serverRoot = 'jThree/wwwroot'
watchForReload = ['jThree/wwwroot/**/*.js', 'jThree/wwwroot/**/*.html', 'jThree/wwwroot/**/*.goml']

typedocSrc = ['jThree/src/**/*.ts']
typedocDest = 'ci/docs'

testTarget = 'jThree/test/build/test.js'

tsconfigPath = './tsconfig.json'

config =
  main:
    entry: 'jThree/src/jThree.ts'
    name: 'j3.js'
    dest: ['jThree/bin/product', 'jThree/wwwroot']
    watch: ['jThree/src/**/*.ts', 'jThree/src/**/*.glsl']

  test:
    entry: 'jThree/test/Test.ts'
    name: 'test.js'
    dest: ['jThree/test/build']
    watch: ['jThree/test/**/*Test.ts']


###
default task
###
gulp.task 'default', ['build']


###
build task
###
gulp.task 'build', ['webpack:main']


###
webpack building task
###
Object.keys(config).forEach (suffix) ->
  c = config[suffix]
  gulp.task "webpack:#{suffix}", ->
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
      .pipe gulp.dest(c.dest[0])
      .on 'end', ->
        for d in c.dest[1..]
          gulp
            .src "#{c.dest[0]}/#{c.name}"
            .pipe gulp.dest(d)

###
watch-mode
###
watching = false
gulp.task 'enable-watch-mode', -> watching = true


###
main watch task
###
gulp.task 'watch:main', ['enable-watch-mode', 'webpack:main'], ->
  gulp.start ['server', 'watch-reload', 'reload']

gulp.task 'watch-reload', ->
  gulp.watch watchForReload, ['reload']


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
    .src typedocSrc
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
gulp.task 'watch:test', ['enable-watch-mode', 'webpack:test'], ->
  gulp.start ['watch-mocha', 'mocha']

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
