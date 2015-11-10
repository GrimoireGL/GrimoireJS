React = require 'react'
Colors = require './colors/definition'
SceneTreeNode = require './debugger-scene-tree-node';
class DebuggerSceneTree extends React.Component
  constructor:(props)->
    super props
    @api = new DebuggerSceneTreeAPI(this);

  render:->
    <div>
    <SceneTreeNode/>
    </div>

class DebuggerSceneTreeAPI
  constructor:(targetTree)->
    @targetTree = targetTree




module.exports = DebuggerSceneTree;
