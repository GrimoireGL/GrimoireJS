chai = require 'chai'
sinonChai = require 'sinon-chai'
chai.use sinonChai

global.assert = chai.assert
global.sinon = require 'sinon'
