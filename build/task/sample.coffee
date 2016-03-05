args = require('yargs').argv
mkdir = require 'mkdirp'
fs = require 'fs'
class SampleGenerator

  getTaskNames:(config)=>
    'sample:public','sample'

  task:(name,config)=>
    sampleName = args.name
    switch name
      when "sample:public"
        @genSample "sample"
      when "sample"
        @genSample "debug"
    genSample:(folderName)=>
      sampleName = args.name
      debugDir = "./wwwroot/debug/";
      dirName = "#{debugDir}#{folderName}/#{sampleName}"
      gomlPath = "#{dirName}/#{sampleName}.goml"
      jsPath = "#{dirName}/#{sampleName}.js"
      mkdir dirName, (err) ->
        if err
          console.error err
          return
        fs.createReadStream "#{debugDir}Template.goml"
          .pipe fs.createWriteStream gomlPath
        fs.createReadStream "#{debugDir}Template.js"
          .pipe fs.createWriteStream jsPath
        fs.readFile "#{debugDir}#{folderName}.json", 'utf-8', (err, data) ->
          jsonData = JSON.parse data
          jsonData.codes[sampleName] =
            goml: "#{sampleName}/#{sampleName}.goml"
            js: ["#{sampleName}/#{sampleName}.js"]
          fs.writeFile "#{debugDir}#{folderName}.json", JSON.stringify(jsonData, null, 2)

module.exports = SampleGenerator
