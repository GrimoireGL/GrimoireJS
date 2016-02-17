args = require('yargs').argv
mkdir = require 'mkdirp'
fs = require 'fs'
class SampleGenerator

  getTaskNames:()=>
    'sample'

  task:(name,config)=>
      sampleName = args.name
      debugDir = "./wwwroot/debug/";
      dirName =  "#{debugDir}debugCodes/#{sampleName}"
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
        fs.readFile "#{debugDir}debug.json", 'utf-8', (err, data) ->
          jsonData = JSON.parse data
          jsonData.codes[sampleName] =
            goml: "#{sampleName}/#{sampleName}.goml"
            js: ["#{sampleName}/#{sampleName}.js"]
          fs.writeFile "#{debugDir}debug.json", JSON.stringify(jsonData, null, 2)

module.exports = SampleGenerator
