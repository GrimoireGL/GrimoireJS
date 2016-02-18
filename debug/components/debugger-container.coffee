React = require 'react'
radium = require 'radium'
DebuggerHeader = require './debugger-header'
DebuggerPreview = require './debugger-preview'
DebuggerTools = require './debugger-tools'
class DebuggerContainer extends React.Component

  constructor:(props)->
    super props

  render:->
    <div>
      <DebuggerHeader/>
      <DebuggerPreview/>
      <DebuggerTools/>
    </div>

module.exports = DebuggerContainer;
