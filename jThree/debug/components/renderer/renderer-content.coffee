React = require 'react'

class RendererContent extends React.Component
  constructor:(props)->
    super props
    @api = new RendererContentAPI();

  render:->
    <div>
    </div>

class RendererContentAPI
  constructor()
    window.j3d.renderers = this

module.exports = RendererContent;
