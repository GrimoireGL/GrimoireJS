jsdom = require('jsdom').jsdom

GomlLoader = require '../../src/Goml/GomlLoader'

describe 'GomlLoader', ->
  describe 'loadScriptTag', ->
    global.document = jsdom '<html><body><script></script></body></html>'
    global.window = global.document.parentWindow
    $ = global.jQuery = require('jquery')(global.window)
    instance = null

    before ->

    beforeEach ->
      instance = new GomlLoader()

    it 'should return goml source string when jQuery object which has src attribute is given', ->
      obj = $('<script type=\'text/goml\'>{{goml}}</script>')
      mock = sinon.mock(instance)
      mock.expects('scriptLoaded').withArgs('{{goml}}')
      instance.loadScriptTag(obj)
      assert(mock.verify() == true)
