React = require 'react'
Title = require './debugger-scene-description-title'
Transform = require './debugger-scene-description-transform'
class DebuggerSceneDescription extends React.Component

  constructor:(props)->
    super props

  render:->
    if !@props.object
      return <h1>There is no selected scene object</h1>
    return <div>
             <Title object={@props.object}/>
             <Transform/>
           </div>


module.exports = DebuggerSceneDescription;
