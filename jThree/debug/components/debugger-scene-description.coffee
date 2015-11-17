React = require 'react'
Title = require './debugger-scene-description-title'

class DebuggerSceneDescription extends React.Component

  constructor:(props)->
    super props

  render:->
    if !@props.object
      return <h1>There is no selected scene object</h1>
    return <div>
             <Title object={@props.object}/>
           </div>


module.exports = DebuggerSceneDescription;
