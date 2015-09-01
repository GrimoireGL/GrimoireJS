chai = require 'chai'
sinonChai = require 'sinon-chai'
chai.use sinonChai

global.expect = chai.expect
global.sinon = require '../../../Sinon.JS/lib/sinon.js'
