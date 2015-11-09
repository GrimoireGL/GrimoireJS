React = require 'react'
radium = require 'radium'
DebuggerHeader = require './debugger-header'
class DebuggerContainer extends React.Component

  constructor:(props)->
    super props

  render:->
    <DebuggerHeader/>

module.exports = DebuggerContainer;
