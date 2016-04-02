React = require 'react'
Radium = require 'radium'
Colors = require './colors/definition'
class DebuggerPreview extends React.Component
  constructor:(props)->
    super props
  render:->
    <div>
      <div style={styles.container} className="canvasContainer">
      </div>
      <div style={styles.debugControl} className="debugControl"/>
    </div>

styles =
  container:
    background:Colors.main.n.light
    margin:"auto"
  debugControl:
    background:"lightgray"

module.exports = DebuggerPreview;
