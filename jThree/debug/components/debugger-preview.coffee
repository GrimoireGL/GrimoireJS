React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
class DebuggerPreview extends React.Component
  constructor:(props)->
    super props
  render:->
    <div style={styles.container}>
    </div>

styles =
  container:
    background:Colors.main.n.light
    margin:"auto"
    width:1280
    height:480
module.exports = DebuggerPreview;
