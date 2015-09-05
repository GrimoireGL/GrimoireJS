jsdom = require('jsdom').jsdom

global.document = jsdom '<html><body></body></html>'
global.window = document.parentWindow

$ = require 'jquery'

GomlLoader = require '../../src/Goml/GomlLoader'

describe 'GomlLoader', ->
  describe 'loadScriptTag', ->
    instance = null

    beforeEach ->
      instance = new GomlLoader()

    it 'should return goml source string when jQuery object which does not have src attribute is given', ->
      obj = $('<script type=\'text/goml\'>{{goml}}</script>')
      mock = sinon.mock(instance)
      mock.expects('scriptLoaded').withArgs('{{goml}}')
      instance.loadScriptTag(obj)
      assert(mock.verify() == true)

  describe 'scriptLoaded', ->
    instance = null

    beforeEach ->
      instance = new GomlLoader()

    it 'should throw error when goml source is empty', ->
      source = ''
      spy = sinon.spy(instance, 'scriptLoaded')
      try spy(source)
      assert(spy.threw() == true)
