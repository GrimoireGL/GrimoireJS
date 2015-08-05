require './spec-helper'

describe 'Test/SomeThing', ->
  describe 'test', ->
    before ->
      # require something
      # SomeThing = require_ '../path/to/something'

    beforeEach ->
      # create instance
      # some = new SomeThing()

    it '2 * 10 should be 20', ->
      result = 2 * 10
      correct = 20
      expect(result).to.equal(correct)
