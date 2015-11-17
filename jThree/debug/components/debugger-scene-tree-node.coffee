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
      children.push(<DebuggerSceneTreeNode children={v.children} nodeLabel={v.name} key={v.ID}/>)
    <TreeNode nodeLabel={@state.nodeLabel}>
      {children}
    </TreeNode>

module.exports = DebuggerSceneTreeNode;
