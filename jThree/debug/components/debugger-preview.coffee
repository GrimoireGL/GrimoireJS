React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
class DebuggerPreview extends React.Component
  constructor:(props)->
    super props
  render:->
    <div style={styles.container} className="canvasContainer">
    </div>

styles =
  container:
    background:Colors.main.n.light
    margin:"auto"
    width:640
    height:480
module.exports = DebuggerPreview;
