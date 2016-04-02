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
    i = 0;
    for v in @api.renderers
      children.push <Tab.Panel title={v.name} key={v.id}><Renderer renderer={v} rdrDebugger={@api.debuggers[i]}/></Tab.Panel>
      i++
    <div>
      <Tab>
        {children}
      </Tab>
    </div>


class RendererContentAPI
  constructor:()->

  @addRenderer:(renderer,debug)=>
    if !RendererContentAPI.renderers
      RendererContentAPI.renderers = []
      RendererContentAPI.debuggers = []
    RendererContentAPI.debuggers.push debug
    RendererContentAPI.renderers.push renderer
    if RendererContentAPI.tabs && RendererContentAPI.tabs.isMounted()
      RendererContentAPI.tabs.setState
        renderers:RendererContentAPI.renderers

window.j3d.renderers = RendererContentAPI
module.exports = RendererContent;
