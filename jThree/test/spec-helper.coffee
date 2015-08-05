chai = require 'chai'
sinonChai = require 'sinon-chai'
chai.use sinonChai

global.expect = chai.expect
global.sinon = require 'sinon'

global.require_ = (target) ->
  delete require.cache[require.resolve target]
  return require target
