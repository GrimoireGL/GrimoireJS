React = require 'react'
Entity = require './renderer-stage-list-entity'
class RendererStageList extends React.Component
  constructor:(props)->
    super props

  render:->
    children = []
    key = 0
    for v in @props.renderer.RenderStageManager.StageChains
      children.push <Entity key={key} index={key} stage={v}/>
      key++;
    <div>
      <p>RenderStages</p>
      {children}
    </div>

module.exports = RendererStageList;
