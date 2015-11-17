React = require 'react'
Tab = require 'react-simpletabs'
Renderer = require './renderer-panel'
class RendererContent extends React.Component
  constructor:(props)->
    super props
    @state = {renderers:[]}
    RendererContentAPI.tabs = this
    @api = RendererContentAPI

  render:->
    children = []
    for v in @api.renderers
      children.push <Tab.Panel title={v.ID} key={v.ID}><Renderer/></Tab.Panel>
    <div>
      <Tab>
        {children}
      </Tab>
    </div>


class RendererContentAPI
  constructor:()->

  @addRenderer:(renderer)=>
    if !RendererContentAPI.renderers
      RendererContentAPI.renderers = []
    RendererContentAPI.renderers.push renderer
    if RendererContentAPI.tabs && RendererContentAPI.tabs.isMounted()
      RendererContentAPI.tabs.setState
        renderers:RendererContentAPI.renderers

window.j3d.renderers = RendererContentAPI
module.exports = RendererContent;
