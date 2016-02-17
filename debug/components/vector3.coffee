React = require 'react'
Radium = require 'radium'
class Vector3 extends React.Component
  constructor:(props)->
    super props
    @state =
      X:props.value.X
      Y:props.value.Y
      Z:props.value.Z

  render:->
    <div style={styles.container}>
      <span style={styles.title}>{@props.title}</span>
      <span style={styles.xLabel}>X
      <input style={styles.input} value={@state.X} onChange={@onValueChange} name="X"></input>
      </span>
      <span style={styles.yLabel}>Y
      <input style={styles.input} value={@state.Y} onChange={@onValueChange} name="Y"></input>
      </span>
      <span style={styles.zLabel}>Z
      <input style={styles.input} value={@state.Z} onChange={@onValueChange} name="Z"></input>
      </span>
    </div>

  onValueChange:(e)=>
    state = {}
    state[e.target.name] = e.target.value
    @setState state
    if !isNaN e.target.value
      @props.onValueChanged e.target.name,e.target.value

  componentWillReceiveProps:(prop)=>
    @setState
      X:prop.value.X
      Y:prop.value.Y
      Z:prop.value.Z

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
