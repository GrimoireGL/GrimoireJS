React = require 'react'
Title = require './renderer-panel-title'
Stages = require './renderer-stage-list'
class RendererPanel extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <Title renderer={@props.renderer} rdrDebugger={@props.rdrDebugger}/>
      <Stages renderer={@props.renderer} rdrDebugger={@props.rdrDebugger}/>
    </div>

module.exports = RendererPanel;
