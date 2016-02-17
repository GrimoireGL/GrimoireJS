React = require 'react'

class DebuggerSceneDescriptionTitle extends React.Component
  constructor:(props)->
    super props

  render:->
    <div style={styles.container}>
      <p>
        <span style={styles.name}>{@props.object.name}</span>
        <span style={styles.typeName}>{"(" + @props.object.getTypeName() + ")"}</span>
      </p>
      <p style={styles.id}>{"ID:" + @props.object.ID}</p>
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

module.exports = DebuggerSceneDescriptionTitle;
