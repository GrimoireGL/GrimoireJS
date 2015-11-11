React = require 'react'
Colors = require './colors/definition'
SceneTreeNode = require './debugger-scene-tree-node';
class DebuggerSceneTree extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <SceneTreeNode api={@props.rootAPI}/>
    </div>

module.exports = DebuggerSceneTree;
