React = require 'react'
Title = require './renderer-panel-title'

class RendererPanel extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <Title renderer={@props.renderer}/>
    </div>

module.exports = RendererPanel;
