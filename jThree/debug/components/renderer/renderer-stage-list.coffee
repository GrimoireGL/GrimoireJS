React = require 'react'
Entity = require './renderer-stage-list-entity'
class RendererStageList extends React.Component
  constructor:(props)->
    super props

  render:->
    children = []
    key = 0
    for v in @props.renderer.RenderPathExecutor.renderPath.path
      children.push <Entity key={key} index={key} stage={v} renderer={@props.renderer}/>
      key++;
    <div>
      <p>RenderStages</p>
      {children}
    </div>

module.exports = RendererStageList;
