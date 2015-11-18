React = require 'react'

class RendererPanelTitle extends React.Component

  constructor:(props)->
    super props

  render:->
    <div style={styles.container}>
      <p>
        <span style={styles.name}>{@props.renderer.name}</span>
        <span style={styles.typeName}>{@props.renderer.getTypeName()}</span>
      </p>
      <p style={styles.id}>{@props.renderer.Camera.ParentScene.ID + "(" + @props.renderer.Camera.name + ")"}</p>
      <p style={styles.id}>{"ID " + @props.renderer.ID}</p>
    </div>

styles =
  container:
    margin:10
  name:
    color:"white"
    fontSize:"x-large"
  typeName:
    color:"lightgray"
  id:
    color:"lightgray"

module.exports = RendererPanelTitle;
