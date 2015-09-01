SampleClass = require './SampleTs'

describe 'Sample', ->
  describe 'sample', ->

    before ->

    beforeEach ->

    it '10 * 2 should be 20', ->
      expect(10 * 2).to.equal(20)

    it '10 * 2 should be 20 with typescript', ->
      instance = new SampleClass(10)
      result = instance.times(2)
      expect(result).to.equal(20)
