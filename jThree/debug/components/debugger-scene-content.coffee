React = require 'react'
Colors = require './colors/definition'
SceneTree = require './debugger-scene-tree'
class DebuggerSceneContent extends React.Component
  constructor:(props)->
    super props

  render:->
    <div>
      <div style={styles.treeContainer}>
        <SceneTree structure={@props.structure} selectionChanged={@selectionChanged}/>
      </div>
      <div style={styles.infoContainer}>
      </div>
    </div>

  selectionChanged:(scene)->
    console.log scene.name

styles =
  treeContainer:
    width:250;
    float:'left';
    height:300;
  infoContainer:
    background:Colors.main.n.default;
    height:300;
    marginLeft:300;


module.exports = DebuggerSceneContent;
