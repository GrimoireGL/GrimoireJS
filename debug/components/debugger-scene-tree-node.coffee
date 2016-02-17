React = require 'react'
TreeNode = require 'react-treeview'
class DebuggerSceneTreeNode extends React.Component
  constructor:(props)->
    super props
    @state =
      children:@props.children
      nodeLabel:@props.nodeLabel

  render:()->
    children = [];
    for v in @state.children
      children.push(<DebuggerSceneTreeNode children={v.children} nodeLabel={v.name} key={v.ID} target={v} selectionChanged={@props.selectionChanged}/>)
    <span onClick={@selectionChanged}>
      <TreeNode nodeLabel={@state.nodeLabel}>
        {children}
      </TreeNode>
    </span>

  selectionChanged:(e)=>
    e.stopPropagation();
    @props.selectionChanged(@props.target)
module.exports = DebuggerSceneTreeNode;
