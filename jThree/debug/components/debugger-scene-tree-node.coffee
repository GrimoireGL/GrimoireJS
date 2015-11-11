React = require 'react'
TreeNode = require 'react-treeview'
class DebuggerSceneTreeNode extends React.Component
  constructor:(props)->
    super props

  render:()->
    children = [];
    for v in @props.api.children
      children.push(<DebuggerSceneTreeNode api={v}/>)
    <TreeNode nodeLabel={@props.api.name}>
      {children}
    </TreeNode>

module.exports = DebuggerSceneTreeNode;
