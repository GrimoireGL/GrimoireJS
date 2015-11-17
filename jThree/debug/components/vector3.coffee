React = require 'react'
Radium = require 'radium'
class Vector3 extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <span style={styles.xLabel}>X
      <input style={styles.input}></input>
      </span>
      <span style={styles.yLabel}>Y
      <input style={styles.input}></input>
      </span>
      <span style={styles.zLabel}>Z
      <input style={styles.input}></input>
      </span>
    </div>

styles =
  input:
    width:150
  xLabel:
    padding:10
    background:"red"
  yLabel:
    background:"green"
    padding:10
  zLabel:
    background:"blue"
    padding:10
module.exports = Vector3;
