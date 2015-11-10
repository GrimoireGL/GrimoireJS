React = require 'react'
Colors = require './colors/definition'
TreeView = require 'react-treeview'
class DebuggerSceneTree extends React.Component
  constructor:(props)->
    super props
    @api = new DebuggerSceneTreeAPI(this);

  render:->
    <div>
      <TreeView nodeLabel="(root)">
        <TreeView nodeLabel="Cube">
        </TreeView>
      </TreeView>
    </div>

class DebuggerSceneTreeAPI
  constructor:(targetTree)->
    @targetTree = targetTree




module.exports = DebuggerSceneTree;
