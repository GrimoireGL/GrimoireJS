React = require 'react'
Colors = require './colors/definition'
SceneTreeNode = require './debugger-scene-tree-node';
class DebuggerSceneTree extends React.Component
  constructor:(props)->
    super props

  render:->
    children = [];
    for v in @props.structure
      children.push(<SceneTreeNode children={v.children} nodeLabel={v.name} key={v.ID} selectionChanged={@props.selectionChanged} target={v}/>)
    <div>
      {children}
    </div>

module.exports = DebuggerSceneTree;
