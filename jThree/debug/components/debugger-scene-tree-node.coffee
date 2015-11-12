React = require 'react'
TreeNode = require 'react-treeview'
class DebuggerSceneTreeNode extends React.Component
  constructor:(props)->
    super props
    @state =
      api:@props.api

  render:()->
    children = [];
    for v in @state.api.children
      children.push(<DebuggerSceneTreeNode api={v}/>)
    @props.api.onUpdate ()=>
      @setState
        api:@props.api
    <TreeNode nodeLabel={@state.api.name}>
      {children}
    </TreeNode>

module.exports = DebuggerSceneTreeNode;
