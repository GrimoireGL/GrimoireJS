SampleClass = require './SampleTs'

describe 'Sample', ->
  describe 'sample', ->

    before ->

    beforeEach ->

    it '10 * 2 should be 20', ->
      assert(10 * 2 == 20)

    it '10 * 2 should be 20 with typescript', ->
      instance = new SampleClass(10)
      result = instance.times(2)
      assert(result == 20)
