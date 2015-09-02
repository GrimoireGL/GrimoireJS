jsdom = require('jsdom').jsdom

GomlLoader = require '../../src/Goml/GomlLoader'

describe 'GomlLoader', ->
  describe 'loadScriptTag', ->
    instance = null

    before ->

    beforeEach ->
      global.document = jsdom '<html><body><script></script></body></html>'
      global.window = global.document.defaultView
      global.navigator = global.window.navigator
      instance = new GomlLoader()

    it 'should return goml source string when jQuery object which has src attribute is given', ->
      mock = $('<script type=\'text/goml\'>{{goml}}</script>')
      stub = sinon.stub(instance, 'scriptLoaded')
      stub.withArgs('{{goml}}').returns(true)
      expect(instance.loadScriptTag(mock)).to.equal(true)
