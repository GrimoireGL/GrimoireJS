React = require 'react'

class DebuggerSceneDescription extends React.Component

  constructor:(props)->
    super props

  render:->
    if !@props.object
      return <h1>There is no selected scene object</h1>
    <div>
      <h1>{@props.object.name}</h1>
    </div>

module.exports = DebuggerSceneDescription;
