React = require 'react'
TreeNode = require 'react-treeview'
class DebuggerSceneTreeNode extends React.Component
  constructor:(props)->
    super props

  render:()->
    itemName = if @props.api? then @props.api.name else '(Root)';
    children = [];
    if @props.api?
      for v in @props.api.children
        children.push(<DebuggerSceneTreeNode api={v}/>)
    <TreeNode nodeLabel={itemName}>
      {children}
    </TreeNode>

module.exports = DebuggerSceneTreeNode;
