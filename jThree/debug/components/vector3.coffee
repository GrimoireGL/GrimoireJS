React = require 'react'
Radium = require 'radium'
class Vector3 extends React.Component
  constructor:(props)->
    super props

  render:->
    <div style={styles.container}>
      <span style={styles.title}>{@props.title}</span>
      <span style={styles.xLabel}>X
      <input style={styles.input} value={@props.value.X} onChange={@onValueChange} name="X"></input>
      </span>
      <span style={styles.yLabel}>Y
      <input style={styles.input} value={@props.value.Y} onChange={@onValueChange} name="Y"></input>
      </span>
      <span style={styles.zLabel}>Z
      <input style={styles.input} value={@props.value.Z} onChange={@onValueChange} name="Z"></input>
      </span>
    </div>

  onValueChange:(e)=>
    if !isNaN e.target.value
      @props.onValueChanged e.target.name,e.target.value
styles =
  container:
    margin:10
  title:
    color:"white"
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
