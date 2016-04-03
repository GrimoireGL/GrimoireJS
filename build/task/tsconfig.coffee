fs = require 'fs'
path = require 'path'
_ = require 'lodash'
globArray = require 'glob-array'

class TsConfigGenerator

  getTaskNames:()=>
    'tscfg'

  task:(name,config)=>
    json = JSON.parse fs.readFileSync path.resolve(config.gulpDir, config.tsconfigPath)
    files = _(globArray.sync(json.filesGlob)).uniq(true)
    json.files = files
    fs.writeFileSync path.resolve(config.gulpDir,config.tsconfigPath), JSON.stringify(json, null, 2)

module.exports = TsConfigGenerator
