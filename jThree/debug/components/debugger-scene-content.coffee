React = require 'react'
Colors = require './colors/definition'
SceneTree = require './debugger-scene-tree'
SceneDescription = require './debugger-scene-description'
class DebuggerSceneContent extends React.Component
  constructor:(props)->
    super props
    @state ={}

  render:->
    <div>
      <div style={styles.treeContainer}>
        <SceneTree structure={@props.structure} selectionChanged={@selectionChanged}/>
      </div>
      <div style={styles.infoContainer}>
        <SceneDescription object={@state.object}/>
      </div>
    </div>

  selectionChanged:(scene)=>
    @setState
      object:scene

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
